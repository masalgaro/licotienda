from rest_framework import serializers

from .models import CategoriaModelo, ProductoModelo


class ProductoInventarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoModelo
        fields = "__all__"

    def validate_precio(self, value):
        if value < 0:
            raise serializers.ValidationError("El precio no puede ser negativo")
        return value

    def validate_existencias(self, value):
        if value < 0:
            raise serializers.ValidationError("El stock no puede ser negativo")
        return value

    def validate_descuento_porcentaje(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("El porcentaje de descuento debe estar entre 0 y 100")
        return value



    def validate(self, attrs):
        if not self.instance and not attrs.get("imagen"):
            raise serializers.ValidationError(
                {"imagen": "Se requiere subir una imagen para los nuevos productos."}
            )

        en_oferta = attrs.get("en_oferta")
        descuento_porcentaje = attrs.get("descuento_porcentaje")

        if self.instance:
            if en_oferta is None:
                en_oferta = self.instance.en_oferta
            if descuento_porcentaje is None:
                descuento_porcentaje = self.instance.descuento_porcentaje

        en_oferta = bool(en_oferta)
        descuento_porcentaje = int(descuento_porcentaje or 0)

        if en_oferta and descuento_porcentaje <= 0:
            raise serializers.ValidationError(
                {"descuento_porcentaje": "Una oferta activa requiere un descuento entre 1 y 100."}
            )

        if not en_oferta:
            attrs["descuento_porcentaje"] = 0

        return attrs

    def to_internal_value(self, data):
        # Manejar el campo 'categoria' si viene como string vacio desde el front
        if "categoria" in data and data["categoria"] == "":
            data = data.copy()
            data["categoria"] = None
        return super().to_internal_value(data)

    def update(self, instance, validated_data):
        # HU 10: Sincronizar campo esta_activo si hay stock
        existencias = validated_data.get("existencias", instance.existencias)
        if existencias > 0:
            validated_data["esta_activo"] = True
        return super().update(instance, validated_data)

    def create(self, validated_data):
        existencias = validated_data.get("existencias", 0)
        if existencias > 0:
            validated_data["esta_activo"] = True
        return super().create(validated_data)


class CategoriaInventarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaModelo
        fields = "__all__"

    def validate_nombre(self, value):
        import re

        val_lower = value.strip().lower()
        # Comprime caracteres repetidos ("ceerrveeezaaa" -> "cerveza")
        val_cleaned = re.sub(r"(.)\1+", r"\1", val_lower)

        conflictos_groups = [
            {"cerveza", "cervezas"},
            {"licor", "licores"},
            {"ron", "rones"},
            {"aguardiente", "aguardientes"},
            {"snack", "snacks"},
        ]

        # 1. Bloqueo inherente de repeticiones ("licoresssss" -> "licores").
        # Si redujiste letras y caíste en un término principal, pero NO lo escribiste bien, se rechaza de tajo.
        for grupo in conflictos_groups:
            if val_cleaned in grupo and val_lower not in grupo:
                raise serializers.ValidationError(
                    f"Ortografía inválida detectada. Utiliza un término correcto como: {', '.join(grupo).title()}."
                )

        # 2. Bloqueo de derivaciones mal escritas (Licore, Cerbeza, etc.)
        malf_map = {
            "licore": "Licores",
            "licores": "Licores",
            "licor": "Licor",
            "cerbeza": "Cervezas",
            "cerbesa": "Cervezas",
            "aguadiente": "Aguardiente",
            "roneses": "Rones",
        }
        if val_lower in malf_map and val_lower not in {
            "licores",
            "licor",
            "cervezas",
            "cerveza",
            "rones",
            "ron",
            "aguardiente",
            "aguardientes",
            "snack",
            "snacks",
        }:
            raise serializers.ValidationError(
                f"Categoría mal escrita. ¿Quisiste decir '{malf_map[val_lower]}'? Escríbelo correctamente."
            )

        # 3. Bloqueo por conflicto singular/plural en Base de Datos
        for grupo in conflictos_groups:
            if val_cleaned in grupo or val_lower in grupo:
                for conf in grupo:
                    if CategoriaModelo.objects.filter(nombre__iexact=conf).exists():
                        if self.instance and self.instance.nombre.lower() == conf:
                            continue
                        raise serializers.ValidationError(
                            f"El término '{value}' genera conflicto con una categoría principal existente en Base de Datos. Variaciones similares están activas."
                        )
                break

        # Validación normal de duplicados exactos
        if not self.instance and CategoriaModelo.objects.filter(nombre__iexact=value).exists():
            raise serializers.ValidationError(f"La categoría '{value}' ya existe.")

        return value
