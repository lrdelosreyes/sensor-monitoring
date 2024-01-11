export default class API {
  private static readonly SENSOR_API = process.env.NEXT_PUBLIC_SENSOR_API_URL

  public static async me() {
    const ACCESS_TOKEN = localStorage.getItem('access_token')
    const data = await fetch(`${API.SENSOR_API}/api/v1/me`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      }
    })
      .then((res: any) => {
        return res?.json()
      })
    return data
  }

  public static async login(
    body: any
  ) {
    const data = await fetch(`${API.SENSOR_API}/api/v1/login`, {
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

  public static async fetchSensors() {
    const data = await fetch(`${API.SENSOR_API}/api/v1/sensors`)
      .then((res: any) => {
        return res?.json()
      })
    return data
  }

  public static async fetchPaginatedSensors(url?: string) {
    const ACCESS_TOKEN = localStorage.getItem('access_token')
    const data = await fetch(
      !!url ? url :
      `${API.SENSOR_API}/api/v1/sensors/paginated`, {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
      }
    )
      .then((res: any) => {
        return res?.json()
      })
    return data
  }

  public static async fetchSensor(id: string) {
    const ACCESS_TOKEN = localStorage.getItem('access_token')
    const data = await fetch(`${API.SENSOR_API}/api/v1/sensors/${id}`, {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
      })
      .then((res: any) => {
        return res?.json()
      })
    return data
  }

  public static async createSensor(
    body: any
  ) {
    const ACCESS_TOKEN = localStorage.getItem('access_token')
    const data = await fetch(`${API.SENSOR_API}/api/v1/sensors`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
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
    const ACCESS_TOKEN = localStorage.getItem('access_token')
    await fetch(`${API.SENSOR_API}/api/v1/sensors/${id}?_method=PATCH`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then((res: any) => res?.json())
  }

  public static async deleteSensor(
    id: string
  ) {
    const ACCESS_TOKEN = localStorage.getItem('access_token')
    await fetch(`${API.SENSOR_API}/api/v1/sensors/${id}?_method=DELETE`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      method: 'POST'
    }).then((res: any) => res?.json())
  }
}