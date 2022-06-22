import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { v4 as uuidv4 } from 'uuid'

import Moment from 'App/Models/Moment'

export default class MomentsController {
  private validationImage = {
    types: ['image'],
    size: '2mb',
  }
  public async store({ request, response }: HttpContextContract) {
    const body = request.body()

    const image = request.file('image', this.validationImage)
    if (image) {
      const imgName = `${uuidv4()}.${image.extname}`
      await image.move(Application.tmpPath('upload'), {
        name: imgName,
      })
      body.image = imgName
    }
    const moment = await Moment.create(body)
    response.status(201)

    return {
      message: 'Momento criado com sucesso',
      data: moment,
    }
  }

  public async index() {
    const moment = await Moment.all()
    return {
      data: moment,
    }
  }
  public async show({ params }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)
    return {
      data: moment,
    }
  }
  public async destroy({ params }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)
    await moment.delete()
    return {
      mesage: 'Momento excluído com sucesso',
      data: moment,
    }
  }
  public async update({ params, request }: HttpContextContract) {
    const body = request.body()
    const moment = await Moment.findOrFail(params.id)

    moment.title = body.title
    moment.description = body.description

    if (moment.image !== body.image || !moment.image) {
      const image = request.file('image', this.validationImage)

      if (image) {
        const imgName = `${uuidv4()}.${image.extname}`
        await image.move(Application.tmpPath('upload'), {
          name: imgName,
        })
        moment.image = imgName
      }
    }
    await moment.save()
    return {
      message: 'Momento atualizado com sucesso!',
      data: moment,
    }
  }
}
