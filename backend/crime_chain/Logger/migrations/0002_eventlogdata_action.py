# Generated by Django 3.0.7 on 2020-07-28 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Logger', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventlogdata',
            name='action',
            field=models.CharField(default='E', max_length=1),
        ),
    ]
