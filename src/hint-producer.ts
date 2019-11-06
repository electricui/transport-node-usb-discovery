import { DiscoveryHintProducer, Hint } from '@electricui/core'

interface USBHintProducerOptions {
  transportKey?: string
  USB: any
  attachmentDelay?: number
}

interface USBDevice {
  deviceDescriptor: {
    idVendor: number
    idProduct: number
  }
}

export default class USBHintProducer extends DiscoveryHintProducer {
  transportKey: string
  usb: any
  options: USBHintProducerOptions
  attachmentDelay: number

  constructor(options: USBHintProducerOptions) {
    super()

    this.transportKey = options.transportKey || 'usb'
    this.options = options

    this.usb = options.USB

    this.attachmentDelay = options.attachmentDelay || 1500

    this.attachmentDetection = this.attachmentDetection.bind(this)
    this.detachmentDetection = this.detachmentDetection.bind(this)
    this.teardown = this.teardown.bind(this)

    this.usb.on('attach', this.attachmentDetection)
    this.usb.on('detach', this.detachmentDetection)
  }

  teardown() {
    this.usb.removeListener('attach', this.attachmentDetection)
    this.usb.removeListener('detach', this.detachmentDetection)
  }

  attachmentDetection = (usbDevice: USBDevice) => {
    const { idVendor, idProduct } = usbDevice.deviceDescriptor

    const hint = new Hint(this.transportKey)

    hint.setAvailabilityHint()

    hint.setIdentification({
      vendorId: idVendor,
      productId: idProduct,
    })

    console.log('attached, delaying: ', this.attachmentDelay)

    // Let the UI know we've found the port after the attachment delay
    setTimeout(() => this.foundHint(hint), this.attachmentDelay)
  }

  detachmentDetection = (usbDevice: USBDevice) => {
    const { idVendor, idProduct } = usbDevice.deviceDescriptor

    const hint = new Hint(this.transportKey)

    hint.setUnavailabilityHint()

    hint.setIdentification({
      vendorId: idVendor,
      productId: idProduct,
    })

    // Let the UI know we've found the port
    this.foundHint(hint)
  }
}
