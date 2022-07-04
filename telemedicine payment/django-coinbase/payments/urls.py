# payments/urls.py

from django.urls import path

from . import views

urlpatterns = [
    path('', views.home_view, name='payments-home'),
    path('success/', views.success_view, name='payments-success'), # new
    path('cancel/', views.cancel_view, name='payments-cancel'), # new
]