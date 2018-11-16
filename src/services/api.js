import axios from 'axios';

const fetchRideRequests = () => {
    try {
        const driversPromise = axios('http://apis.is/rides/samferda-drivers/');
        const passengersPromise = axios('http://apis.is/rides/samferda-passengers/');
  
        return Promise.all([driversPromise, passengersPromise]);
      } catch (e) {
        console.error(e);
      }

}

export default { fetchRideRequests };