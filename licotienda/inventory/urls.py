from django.urls import path
from . import views

urlpatterns = [
    path('', views.store_view, name='store'),
    path('categories/', views.categories_view, name='categories'),
    path('cart/', views.cart_view, name='cart'),
    path('checkout/', views.checkout_view, name='checkout'),
    path('login/', views.login_view, name='login'),
    path('about/', views.about_view, name='about'),
    
    # Admin 
    path('admin-panel/', views.admin_dashboard, name='admin_dashboard'),
    path('admin-panel/add/', views.product_create, name='product_create'),
    path('admin-panel/<int:pk>/edit/', views.product_edit, name='product_edit'),
    path('admin-panel/<int:pk>/delete/', views.product_delete, name='product_delete'),
]
