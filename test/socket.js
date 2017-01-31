import test from "ava"
import parser from "socket.io-parser"
const [encoder, decoder] = [new parser.Encoder(), new parser.Decoder()]

test("socket io encode", t => {
  const packet = {
    type: parser.EVENT,
    nsp: "/xxx/vvv",
    data: {
      x: 'test-packet'
    },
    id: 13
  }
  encoder.encode(packet, function(encodedPackets) {
    t.is(encodedPackets[0], `2/xxx/vvv,13{"x":"test-packet"}`)
  })
})

test("socket io encode", t => {
  const packet = {
    type: parser.BINARY_EVENT,
    nsp: "/xxx/vvv",
    data: new Buffer("zzzccccddd"),
    id: 13
  }
  encoder.encode(packet, function(encodedPackets) {
    t.is(encodedPackets[0], `51-/xxx/vvv,13{"_placeholder":true,"num":0}`)
    t.is(encodedPackets[1].toString(), "zzzccccddd")
  })
})

test("socket io decode", t =>{
  const encodedPackets=[`2/xxx/vvv,13{"x":"test-packet"}`]
  const decoder = new parser.Decoder();
  decoder.on('decoded', function(decodedPacket) {
    t.deepEqual(decodedPacket, {
      type: 2,
      nsp: "/xxx/vvv",
      id: 13,
      data: {
        x: 'test-packet'
      }
    })
  })
  encodedPackets.forEach(decoder.add.bind(decoder))
})