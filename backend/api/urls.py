from django.urls import path
from .views import CurrentUserView

urlpatterns = [
    path("api/user/me/", CurrentUserView.as_view(), name="current_user"),
]