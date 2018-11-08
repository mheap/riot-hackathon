import struct
import json

try:
    from cStringIO import StringIO
except:
    from StringIO import StringIO

ROFL_MAGIC = "RIOT" + chr(0) * 2

class Struct(object):
    format = None
    extradata = None

    @classmethod
    def get_extradata(cls, fileobj):
        return [None] * len(cls.get_format(fileobj, None))

    @classmethod
    def get_format(cls, fileobj, extradata):
        return cls.format

    @classmethod
    def read(cls, fh, fileobj, extradata=None):
        format = cls.get_format(fileobj, extradata=extradata)
        f_str = fh.read(struct.calcsize(format))
        res = struct.unpack(format, f_str)
        me = cls()
        me.unpack_tuple(res, fileobj, extradata)
        return me

    def unpack_tuple(self, res, fileobj, extradata):
        for field_name, field_value in zip(self.fields, res):
            custom_func = getattr(self, "unpack_{}".format(field_name), None)
            if custom_func is not None:
                custom_func(field_name, field_value, fileobj, extradata)
            else:
                setattr(self, field_name, field_value)


class CompositeStruct(Struct):
    @classmethod
    def read(cls, fh, fileobj, extradata=None):
        self = cls()
        for clazz, field in zip(cls.get_format(fileobj), cls.fields):
            setattr(self, field, clazz.read(fh, self, extradata=extradata))
        return self


class CompositeStructList(Struct):
    @classmethod
    def read(cls, fh, fileobj, extradata=None):
        self = cls()
        self.outer = fileobj
        self.data = []
        for clazz, ed in zip(
            cls.get_format(fileobj, extradata=extradata), cls.get_extradata(fileobj)
        ):
            self.data.append(clazz.read(fh, self, extradata=ed))
        return self


class RoflHeader(Struct):
    format = "6s256sHIIIIII"
    fields = [
        "magic",
        "signature",
        "header_len",
        "file_len",
        "metadata_offset",
        "metadata_len",
        "payload_header_offset",
        "payload_header_len",
        "payload_offset",
    ]


class RoflMetadata(Struct):
    fields = ["json"]

    @classmethod
    def get_format(cls, fileobj, extradata):
        return "{}s".format(fileobj.header.metadata_len)

    def unpack_json(self, field_name, field_value, fileobj, extradata):
        self.json = json.loads(field_value)
        self.json["statsJson"] = json.loads(self.json["statsJson"])
        return self.json

    def as_json(self):
        return json.dumps(self.json, indent=4)


class RoflPayloadHeader(Struct):
    format = "QIIIIIIH"
    fields = [
        "game_id",
        "game_length",
        "keyframe_count",
        "chunk_count",
        "end_startup_chunk_id",
        "start_game_chunk_id",
        "keyframe_interval",
        "encryption_key_length",
    ]

    def __str__(self):
        return (
            "<RoflPayloadHeader - game ID: {} - game length: {} - "
            + "keyframe count: {} - chunk count: {}>".format(
                self.game_id, self.game_length, self.keyframe_count, self.chunk_count
            )
        )


class RoflFile(object):
    @classmethod
    def read(cls, fh):
        self = cls()
        self.header = RoflHeader.read(fh, self)
        if self.header.magic != ROFL_MAGIC:
            raise Exception("Decoding error - magic invalid")
        self.metadata = RoflMetadata.read(fh, self)
        self.payload_header = RoflPayloadHeader.read(fh, self)
        return self

    def __str__(self):
        return self.metadata.as_json()


def process_rofl(rofl_file):
    with open(rofl_file, "rb") as f:
        return RoflFile.read(f)
