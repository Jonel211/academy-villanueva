from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InstructorViewSet, TallerViewSet

router = DefaultRouter()
router.register(r'instructors', InstructorViewSet)
router.register(r'talleres', TallerViewSet)

urlpatterns = [
    path('', include(router.urls)),
]