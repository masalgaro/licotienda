from django.urls import path
from .infraestructura.views import CheckoutLookupView, CheckoutSaveView

urlpatterns = [
    path('checkout-lookup/', CheckoutLookupView.as_view(), name='checkout_lookup'),
    path('checkout-save/', CheckoutSaveView.as_view(), name='checkout_save'),
]
