from dataclasses import dataclass
from typing import Optional
from datetime import datetime

@dataclass
class Categoria:
    id: Optional[int]
    nombre: str

@dataclass
class Producto:
    id: Optional[int]
    nombre: str
    precio: float
    descripcion: str
    imagen_url: str
    categoria_id: Optional[int]
    esta_activo: bool
    creado_en: Optional[datetime] = None
    actualizado_en: Optional[datetime] = None
