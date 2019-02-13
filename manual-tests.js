const usb = require('usb')

const devices = {
  '1027': [{ productID: 24577, name: 'FTDI FT232R UART' }],
  '1027': [{ productID: 24597, name: 'FTDI FT231X' }],
  '9025': [
    { productID: 1, name: 'Arduino Uno' },
    { productID: 16, name: 'Arduino Mega 2560' },
    { productID: 59, name: 'Arduino Serial Adapter' },
    { productID: 63, name: 'Arduino Mega ADK' },
    { productID: 66, name: 'Arduino Mega 2560 R3' },
    { productID: 67, name: 'Arduino Uno R3' },
    { productID: 68, name: 'Arduino Mega ADK R3' },
    { productID: 69, name: 'Arduino Serial R3' },
    { productID: 32822, name: 'Arduino Leonardo' },
  ],
  '5824': [{ productID: 1155, name: 'Teensyduino' }],
  '4292': [{ productID: 60000, name: 'CP210x UART Bridge' }],
  '1659': [{ productID: 8963, name: 'Prolific PL2303' }],
  '6790': [{ productID: 29987, name: 'Qinheng CH340' }],
  '10755': [
    { productID: 1, name: 'Linino ONE (bootloader)' },
    { productID: 54, name: 'Arduino Leonardo (bootloader)' },
    { productID: 55, name: 'Arduino Micro (bootloader)' },
    { productID: 56, name: 'Arduino Robot Control (bootloader)' },
    { productID: 57, name: 'Arduino Robot Motor (bootloader)' },
    { productID: 58, name: 'Arduino Micro ADK rev3 (bootloader)' },
    { productID: 59, name: 'Arduino Serial' },
    { productID: 60, name: 'Arduino Explora (bootloader)' },
    { productID: 61, name: 'Arduino Due (usb2serial)' },
    { productID: 62, name: 'Arduino Due' },
    { productID: 65, name: 'Arduino Yun' },
    { productID: 66, name: 'Arduino Mega 2560 Rev3' },
    { productID: 67, name: 'Arduino Uno Rev3' },
    { productID: 77, name: 'Arduino Zero Pro' },
    { productID: 32769, name: 'Linino ONE' },
    { productID: 32822, name: 'Arduino Leonardo' },
    { productID: 32823, name: 'Arduino Micro' },
    { productID: 32824, name: 'Arduino Robot Control' },
    { productID: 32825, name: 'Arduino Robot Motor' },
    { productID: 32826, name: 'Arduino Micro ADK rev3' },
    { productID: 32828, name: 'Arduino Explora' },
    { productID: 32833, name: 'Arduino Yun' },
    { productID: 32845, name: 'Arduino Zero Pro' },
  ],
}

function findDeviceName(idVendor, idProduct) {
  const vendorProducts = devices[idVendor]

  if (!vendorProducts) {
    return null
  }

  const product = vendorProducts.find(
    product => product.productID === idProduct,
  )

  if (!product) {
    return null
  }

  return product.name
}

usb.on('attach', device => {
  const { idVendor, idProduct } = device.deviceDescriptor

  const name = findDeviceName(idVendor, idProduct)

  if (name) {
    console.log(`${name} attached`)
  }
})

usb.on('detach', device => {
  const { idVendor, idProduct } = device.deviceDescriptor

  const name = findDeviceName(idVendor, idProduct)

  if (name) {
    console.log(`${name} detached`)
  }
})
