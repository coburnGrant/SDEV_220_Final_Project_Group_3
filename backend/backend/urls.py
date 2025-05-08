from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from api.views.home_view import HomeView, logout_view
from django.conf import settings
from django.contrib.auth.views import LoginView

schema_view = get_schema_view(
   openapi.Info(
      title="Warehouse Management System API",
      default_version='v1',
      description="API documentation for the Warehouse Management System",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@example.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
   patterns=[
       path('api/', include('api.urls')),
   ],
)

urlpatterns = [
   # Home page
   path('', name='home', view=HomeView.as_view()),

   # Login and Logout
   path('logout/', logout_view, name='logout'),
   path('login/', LoginView.as_view(template_name='admin/login.html', next_page='/'), name='login'),
    
   # Admin URLs
   path("admin/", admin.site.urls),
   path('accounts/login/', LoginView.as_view(template_name='admin/login.html', next_page='/'), name='login'),

   # Include API URLs
   path("api/", include("api.urls")),
   path("api-auth/", include("rest_framework.urls")),
    
   # Documentation URLs
   path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
   path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
   path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]