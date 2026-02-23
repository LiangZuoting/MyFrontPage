from tortoise import Model
from tortoise.fields import IntField, CharField, BooleanField, DatetimeField


class Websites(Model):
    id = IntField(pk=True)
    name = CharField(max_length=64, unique=True)
    url = CharField(max_length=2048, unique=True)
    category = CharField(max_length=64)
    topmost = BooleanField(default=False)
    ctime = DatetimeField(auto_now=True)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "url": self.url, "category": self.category, "topmost": self.topmost, "ctime": str(self.ctime)}
