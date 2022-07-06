import { DiscoveryHintProducer, Hint } from '@electricui/core'
import { CancellationToken } from '@electricui/async-utilities'

import type { usb } from 'usb'

interface USBHintProducerOptions {
  transportKey?: string
  usb: typeof usb
  connectionPollingTime?: number
}

interface USBDevice {
  deviceDescriptor: {
    idVendor: number
    idProduct: number
  }
}

export default class USBHintProducer extends DiscoveryHintProducer {
  transportKey: string
  usb: typeof usb
  options: USBHintProducerOptions
  connectionPollingTime: number

  constructor(options: USBHintProducerOptions) {
    super()

    if (!options.usb) {
      throw new Error('usb must be passed to transport-node-usb-discovery.')
    }

    this.transportKey = options.transportKey || 'usb'
    this.options = options

    this.usb = options.usb
    this.connectionPollingTime = options.connectionPollingTime ?? 5_000

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

    // Node Serialport uses hex representations of these, so lets do the same thing.
    hint.setIdentification({
      vendorId: idVendor,
      productId: idProduct,
    })

    // Send up our hint immediately, the transformer will poll until it finds the
    // correct serialport

    // Poll for say 5 seconds
    const cancellationToken = new CancellationToken('usb attachment detection hint')
    cancellationToken.deadline(this.connectionPollingTime)

    this.foundHint(hint, cancellationToken).catch(err => {
      if (!cancellationToken.caused(err)) {
        console.warn("Couldn't pass USB attachment hint up")
      }
    })
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
    const cancellationToken = new CancellationToken('usb detachment detection hint')
    cancellationToken.deadline(this.connectionPollingTime)

    this.foundHint(hint, cancellationToken).catch(err => {
      if (!cancellationToken.caused(err)) {
        console.warn("Couldn't pass USB detachment hint up")
      }
    })
  }
}
