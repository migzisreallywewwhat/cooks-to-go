# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_recipe_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipecomponent',
            name='extra',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
    ]
