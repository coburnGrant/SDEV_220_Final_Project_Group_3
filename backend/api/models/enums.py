from enum import Enum

class ShipmentType(Enum):
    INCOMING = 'IN'
    OUTGOING = 'OUT'

    @classmethod
    def choices(cls):
        return [(e.value, e.name) for e in cls]

class ShipmentStatus(Enum):
    PENDING = 'PENDING'
    IN_TRANSIT = 'IN_TRANSIT'
    DELIVERED = 'DELIVERED'
    CANCELLED = 'CANCELLED'

    @classmethod
    def choices(cls):
        return [(e.value, e.name) for e in cls] 