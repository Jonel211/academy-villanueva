from rest_framework import serializers
from .models import Instructor, Taller

class InstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instructor
        fields = '__all__'

class TallerSerializer(serializers.ModelSerializer):
    # Esto nos permite ver los datos del instructor o enviar su ID al crear
    instructor_detalle = InstructorSerializer(read_only=True, source='instructor')
    
    class Meta:
        model = Taller
        fields = ['id', 'nombre', 'fecha', 'capacidad', 'imagen', 'instructor', 'instructor_detalle']