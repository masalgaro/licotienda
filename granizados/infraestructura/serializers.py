from decimal import Decimal

from rest_framework import serializers

from .models import PRECIO_BASE_GRANIZADO, Granizado, Ingrediente


class IngredienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingrediente
        fields = ["id", "nombre", "categoria", "precio_adicional", "disponible"]


class GranizadoSerializer(serializers.ModelSerializer):
    ingredientes = IngredienteSerializer(many=True, read_only=True)

    class Meta:
        model = Granizado
        fields = [
            "id",
            "tiene_alcohol",
            "ingredientes",
            "precio_base",
            "precio_total",
            "creado_en",
        ]


class CrearGranizadoSerializer(serializers.Serializer):
    tiene_alcohol = serializers.BooleanField()
    ingredientes = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        allow_empty=False,
    )

    def validate(self, attrs):
        ids_ingredientes = list(dict.fromkeys(attrs["ingredientes"]))
        ingredientes = list(Ingrediente.objects.filter(id__in=ids_ingredientes))
        ingredientes_por_id = {ingrediente.id: ingrediente for ingrediente in ingredientes}

        faltantes = [
            ingrediente_id
            for ingrediente_id in ids_ingredientes
            if ingrediente_id not in ingredientes_por_id
        ]
        if faltantes:
            raise serializers.ValidationError(
                {"ingredientes": f"Ingredientes no encontrados: {faltantes}"}
            )

        no_disponibles = [
            ingrediente.nombre for ingrediente in ingredientes if not ingrediente.disponible
        ]
        if no_disponibles:
            raise serializers.ValidationError(
                {"ingredientes": f"Ingredientes no disponibles: {', '.join(no_disponibles)}"}
            )

        tiene_alcohol = attrs["tiene_alcohol"]
        incluye_licor = any(
            ingrediente.categoria == Ingrediente.CATEGORIA_LICOR
            for ingrediente in ingredientes
        )
        if not tiene_alcohol and incluye_licor:
            raise serializers.ValidationError(
                {"ingredientes": "Un granizado sin alcohol no puede incluir licores."}
            )

        attrs["ingredientes"] = [ingredientes_por_id[ingrediente_id] for ingrediente_id in ids_ingredientes]
        return attrs

    def create(self, validated_data):
        ingredientes = validated_data.pop("ingredientes")
        precio_total = PRECIO_BASE_GRANIZADO + sum(
            (ingrediente.precio_adicional for ingrediente in ingredientes),
            Decimal("0.00"),
        )
        granizado = Granizado.objects.create(
            tiene_alcohol=validated_data["tiene_alcohol"],
            precio_base=PRECIO_BASE_GRANIZADO,
            precio_total=precio_total,
        )
        granizado.ingredientes.set(ingredientes)
        return granizado


class AgregarGranizadoCarritoSerializer(serializers.Serializer):
    granizado_id = serializers.IntegerField(min_value=1)

    def validate_granizado_id(self, value):
        try:
            return Granizado.objects.prefetch_related("ingredientes").get(id=value)
        except Granizado.DoesNotExist as exc:
            raise serializers.ValidationError("Granizado no encontrado.") from exc


def construir_item_carrito(granizado):
    return {
        "tipo": "granizado",
        "id": f"granizado-{granizado.id}",
        "granizado": granizado.id,
        "nombre": f"Granizado {'con alcohol' if granizado.tiene_alcohol else 'sin alcohol'}",
        "precio": str(granizado.precio_total),
        "quantity": 1,
        "ingredientes": IngredienteSerializer(granizado.ingredientes.all(), many=True).data,
        "tiene_alcohol": granizado.tiene_alcohol,
    }
