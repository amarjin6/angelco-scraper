from enum import Enum


class Location(Enum):
    LOCAL = 'local'
    REMOTE = 'remote'
    GLOBAL = 'global'

    def __str__(self):
        return self.value
