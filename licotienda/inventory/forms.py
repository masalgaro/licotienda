from django import forms
from .models import Product

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['name', 'price', 'description', 'image_url', 'category', 'is_active']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'w-full bg-slate-100 dark:bg-card-dark border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary'}),
            'price': forms.NumberInput(attrs={'class': 'w-full bg-slate-100 dark:bg-card-dark border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary'}),
            'description': forms.Textarea(attrs={'class': 'w-full bg-slate-100 dark:bg-card-dark border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary', 'rows': 3}),
            'image_url': forms.URLInput(attrs={'class': 'w-full bg-slate-100 dark:bg-card-dark border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary'}),
            'category': forms.TextInput(attrs={'class': 'w-full bg-slate-100 dark:bg-card-dark border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'rounded border-slate-300 text-primary focus:ring-primary'}),
        }
