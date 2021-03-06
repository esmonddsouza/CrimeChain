# Generated by Django 3.0.7 on 2020-07-28 17:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Logger', '0003_auto_20200728_1605'),
    ]

    operations = [
        migrations.CreateModel(
            name='RoleAssignmentLogData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('userId', models.CharField(max_length=256)),
                ('adminAccountId', models.CharField(max_length=256)),
                ('linkedAccountId', models.CharField(max_length=256)),
                ('role', models.CharField(max_length=5)),
                ('dateTime', models.DateTimeField(auto_now_add=True)),
                ('policeStationId', models.CharField(max_length=256)),
                ('action', models.CharField(default='A', max_length=1)),
            ],
        ),
    ]
