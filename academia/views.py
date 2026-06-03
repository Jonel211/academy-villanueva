from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Instructor, Taller
from .serializers import InstructorSerializer, TallerSerializer

class InstructorViewSet(viewsets.ModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer

class TallerViewSet(viewsets.ModelViewSet):
    queryset = Taller.objects.all()
    serializer_class = TallerSerializer