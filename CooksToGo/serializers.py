from app import models
from rest_framework import serializers, viewsets
from app.utils import normalize_recipe_params


class UnitOfMeasureSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.UnitOfMeasure
        fields = ('pk', 'name')


class StepSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Step
        fields = ('sequence', 'instruction')


class IngredientTypeSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = models.IngredientType
        fields = (
            'pk',
            'name',
            'picture',
        )


class IngredientSerializer(serializers.ModelSerializer):
    type = IngredientTypeSerializer(many=False, read_only=True)

    class Meta:
        model = models.Ingredient
        fields = ('pk', 'banner', 'type', 'icon', 'name', 'description')


class RecipeComponentSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(many=False, read_only=True)
    unit_of_measure = UnitOfMeasureSerializer(many=False, read_only=True)

    class Meta:
        model = models.RecipeComponent
        fields = ('quantity', 'unit_of_measure', 'ingredient')


class RecipeOverviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Recipe
        fields = (
            'pk',
            'url',
            'name',
            'description',
            'banner',
            'icon',
            'type',
        )


class RecipeTypeSerializer(serializers.HyperlinkedModelSerializer):
    recipes = RecipeOverviewSerializer(many=True, read_only=True)

    class Meta:
        model = models.RecipeType
        fields = (
            'pk',
            'name',
            'picture',
            'recipes',
        )


class RecipeSerializer(serializers.HyperlinkedModelSerializer):
    recipe_components = RecipeComponentSerializer(many=True, read_only=True)
    steps = StepSerializer(many=True, read_only=True)
    type = RecipeTypeSerializer(many=False, read_only=True)

    class Meta:
        model = models.Recipe
        fields = (
            'pk',
            'name',
            'description',
            'banner',
            'icon',
            'type',
            'recipe_components',
            'steps'
        )


class RecipeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Recipe.objects.all()
    serializer_class = RecipeSerializer

    def list(self, request):
        '''
        Method override for URLs like:
        http://<domain>/recipes/?quantities=1,2,3&units=1,2,3&ingredients=1,2,3
        '''
        data = normalize_recipe_params(
            request.GET.get('quantities', None),
            request.GET.get('units', None),
            request.GET.get('ingredients', None),
        )

        # let's change the serializer for listing recipes
        # so that ingredients and steps are not included
        self.serializer_class = RecipeOverviewSerializer
        if data is not None:
            self.queryset = models.Recipe.objects.has_ingredients(data)
        return super(RecipeViewSet, self).list(self, request)


class RecipeTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.RecipeType.objects.all()
    serializer_class = RecipeTypeSerializer


class IngredientTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.IngredientType.objects.all()
    serializer_class = IngredientTypeSerializer


class IngredientViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Ingredient.objects.all()
    serializer_class = IngredientSerializer
