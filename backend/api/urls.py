from django.urls import path
from .views import CurrentUserView
from .views import home

urlpatterns = [
    path("api/user/me/", CurrentUserView.as_view(), name="current_user"),
    path('', home),
]