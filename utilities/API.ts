export default class API {
  private static readonly SENSOR_API = process.env.NEXT_PUBLIC_SENSOR_API_URL

  public static async fetchSensors() {
    const data = await fetch(`${API.SENSOR_API}/api/v1/sensors`)
      .then((res: any) => {
        return res?.json()
      })
    return data
  }

  public static async fetchPaginatedSensors(url?: string) {
    const data = await fetch(
      !!url ? url :
      `${API.SENSOR_API}/api/v1/sensors/paginated`
    )
      .then((res: any) => {
        return res?.json()
      })
    return data
  }

  public static async fetchSensor(id: string) {
    const data = await fetch(`${API.SENSOR_API}/api/v1/sensors/${id}`)
      .then((res: any) => {
        return res?.json()
      })
    return data
  }

  public static async createSensor(
    body: any
  ) {
    const data = await fetch(`${API.SENSOR_API}/api/v1/sensors`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then((res: any) => res?.json())

    return data
  }

  public static async updateSensor(
    id: string,
    body: any
  ) {
    await fetch(`${API.SENSOR_API}/api/v1/sensors/${id}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then((res: any) => res?.json())
  }

  public static async deleteSensor(
    id: string
  ) {
    await fetch(`${API.SENSOR_API}/api/v1/sensors/${id}`, {
      method: 'DELETE'
    }).then((res: any) => res?.json())
  }
}