import polyline from '@mapbox/polyline'
import turf from '@turf/turf'
import moment from 'moment'
import Logger from "@harmonyjs/logger";

const UPDATE_INTERVAL = 1000
const SPEED_VARIATION = 2
const TEMPERATURE_VARIATION = 1

function VehicleService() {
    const instance = ({

        logger: Logger({ name: 'Vehicle', configuration: { console: true } }),

        vehicles: [] as any[],

        configure(vehicles: any) {
            // Initialize vehicles
            this.initializeVehicles(vehicles)

            // Update vehicles
            setInterval( () => this.updateVehicles(), UPDATE_INTERVAL );
        },

        initializeVehicles(vehicles: any[]) {
            this.vehicles = vehicles.map((vehicle: any) => {
                const coordinates = polyline.decode(vehicle.polyline)
                const line = turf.lineString(coordinates)
                const options: any = { units: 'meters' }
                const location: any = turf.along(line, 0, options)

                return {
                    ...vehicle,
                    defaultSpeed: vehicle.speed,
                    defaultTemperature: vehicle.temperature,
                    location: location.geometry.coordinates,
                    line,
                    distance: 0,
                }
            })
        },

        updateVehicles() {
            this.vehicles.forEach((vehicle: any) => {
                // Update only if vehicle is active
                if (vehicle.online) {
                    // Update vehicle position
                    const options: any = { units: 'meters' }
                    const location: any = turf.along(vehicle.line, vehicle.distance, options)
                    vehicle.location = location.geometry.coordinates

                    // Increment traveled distance
                    const metersTraveled = vehicle.defaultSpeed / 3.6
                    vehicle.distance += metersTraveled

                    // Reinitialize position at end of route
                    const routeLength = turf.length(vehicle.line, {units: 'meters'});

                    if (vehicle.distance >= routeLength) {
                        vehicle.distance = 0;
                    }

                    // Random speed
                    const minSpeed = vehicle.defaultSpeed - SPEED_VARIATION
                    const maxSpeed = vehicle.defaultSpeed + SPEED_VARIATION
                    vehicle.speed = Math.floor(Math.random() * (maxSpeed - minSpeed + 1) + minSpeed)

                    // Random temperature
                    const minTemp = vehicle.defaultTemperature - TEMPERATURE_VARIATION
                    const maxTemp = vehicle.defaultTemperature + TEMPERATURE_VARIATION
                    vehicle.temperature = Math.floor(Math.random() * (maxTemp - minTemp + 1) + minTemp)
                } else {
                    vehicle.speed = 0
                }
            })
        },

        getDrivers() : any[] {
            return this.vehicles
        },
        
        setVehicleOnline(vehicleId: string): void {
            const vehicle = this.vehicles.find(v => v.id === vehicleId)
            if (!vehicle) throw new Error('Vehicle not found')
            vehicle.online = true;
        }
    })

    return instance
}

export default VehicleService()
