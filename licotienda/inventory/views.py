from django.shortcuts import render, redirect, get_object_or_404
from .models import Product
from .forms import ProductForm

def store_view(request):
    products = Product.objects.filter(is_active=True)
    return render(request, 'Store.html', {'products': products})

def categories_view(request):
    products = Product.objects.filter(is_active=True)
    return render(request, 'categories.html', {'products': products})

def cart_view(request):
    return render(request, 'carrito.html')

def checkout_view(request):
    return render(request, 'Pasarela.html')

def login_view(request):
    return render(request, 'login.html')

def about_view(request):
    return render(request, 'About_us.html')

# --- ADMIN CRUD VIEWS ---

def admin_dashboard(request):
    products = Product.objects.all()
    return render(request, 'admin_panel.html', {'products': products})

def product_create(request):
    if request.method == 'POST':
        form = ProductForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('admin_dashboard')
    else:
        form = ProductForm()
    return render(request, 'admin_form.html', {'form': form, 'title': 'Nuevo Producto'})

def product_edit(request, pk):
    product = get_object_or_404(Product, pk=pk)
    if request.method == 'POST':
        form = ProductForm(request.POST, instance=product)
        if form.is_valid():
            form.save()
            return redirect('admin_dashboard')
    else:
        form = ProductForm(instance=product)
    return render(request, 'admin_form.html', {'form': form, 'title': 'Editar Producto', 'product': product})

def product_delete(request, pk):
    product = get_object_or_404(Product, pk=pk)
    if request.method == 'POST':
        product.delete()
        return redirect('admin_dashboard')
    return render(request, 'admin_confirm_delete.html', {'product': product})
