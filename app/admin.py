from django.contrib import admin

from app import models


class StepInline(admin.TabularInline):
    model = models.Step
    extra = 0


class RecipeInline(admin.TabularInline):
    model = models.RecipeComponent


class RecipeAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields': [
            'name', 'categories', 'description',
            'default_serving_size', 'time_to_complete',
        ]}),
        ('More Information', {'fields': ['banner', 'icon']}),
    ]

    inlines = (RecipeInline, StepInline)
    search_fields = 'name', 'description'
    list_filter = 'categories',


class IngredientAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields': ['name', 'type', 'description']}),
        ('More Information', {'fields': ['banner', 'icon']}),
    ]

    search_fields = 'name', 'description'
    list_filter = 'type',


class RatingAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields': ['recipe', 'rating', 'who']})
    ]

    search_fields = 'recipe', 'rating', 'who'
    list_filter = 'recipe', 'rating', 'who'
    list_display = ('recipe', 'rating', 'who')

admin.site.register(models.RecipeType)
admin.site.register(models.IngredientType)
admin.site.register(models.RecipeComponent)
admin.site.register(models.UnitOfMeasure)
admin.site.register(models.Recipe, RecipeAdmin)
admin.site.register(models.Ingredient, IngredientAdmin)
admin.site.register(models.Rating, RatingAdmin)
