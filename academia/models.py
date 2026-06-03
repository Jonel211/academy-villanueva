from django.db import models

# Create your models here.

class Instructor(models.Model):
    nombre = models.CharField(max_length=100)
    especialidad = models.CharField(max_length=100)
    correo = models.EmailField(unique=True)

    def __str__(self):
        return self.nombre

class Taller(models.Model):
    nombre = models.CharField(max_length=150)
    fecha = models.DateTimeField()
    capacidad = models.IntegerField()
    imagen = models.ImageField(upload_to='talleres/', null=True, blank=True)
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE, related_name='talleres')

    def __str__(self):
        return self.nombre