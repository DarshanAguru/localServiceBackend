import {
  findAllAppointmentsOfConsumer,
  findAllAppointmentsOfProvider,
  findAndDeleteAppointment,
  findAppointmentByAppointmentId,
  findAppointmentByIds,
  insertAppointment,
  updateDateOfAppointment,
  updateStatusOfAppointment,
} from '../repo/appointment.repo.js';

export const addNewAppointment = async (data) => {
  try {
    const appointment = await findAppointmentByIds(
      data.consumerId,
      data.providerId,
      data.serviceId,
    );
    const sameServiceAppointments = await findAppointmentOfConsumerWithService(
      data.consumerId,
      data.serviceId
    );

    const Approved = sameServiceAppointments.filter((appointment) => appointment.status.toLowerCase() === "approved");
    const hasAnyApprovedInRange = Approved.filter((appointment) => (Date.now() <=  Date.parse(appointment.preferredDate)) );
    if (appointment || hasAnyApprovedInRange.length > 0) {
      console.info('Appointment already present for given service');
      return {error: "Appointment already Present (approved) for given service", data: null};
    }
    const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
    const preferred = new Date(data.preferredDate);
    const dataToSend = {...data, deadline: new Date(preferred.getTime() + TWO_DAYS_MS)};
    const inserted = await insertAppointment(dataToSend);
    return {error: null, data: inserted};
  } catch (err) {
    console.log('New Appointment Error', err);
    return {error: "Error", data: null};
  }
};

export const fetchAppointmentsOfConsumer = async (id) => {
  try {
    const appointmentsOfConsumer = await findAllAppointmentsOfConsumer(id);
    if (!appointmentsOfConsumer) {
      return null;
    }
    const updatedAppointmentList = [];
    for(let appointment of appointmentsOfConsumer)
    {
      let status = appointment.status.toLowerCase();
      if (Date.parse(appointment.deadline) <= Date.now())
      {
        if(status === "approved")
        {
          await updateStatusOfAppointment("cancelled",appointment.id);
          status = "cancelled";
        }
        else if(status === "requested")
        {
          await updateStatusOfAppointment("cancelled", appointment.id);
          status = "cancelled";
        }
      }
      updatedAppointmentList.push({...appointment, status: status});
    }
    return updatedAppointmentList;
  } catch (err) {
    console.log('Fetch Appointments of Consumer Error', err);
    return null;
  }
};

export const fetchAppointmentsOfProvider = async (id) => {
  try {
    const appointmentsOfProvider = await findAllAppointmentsOfProvider(id);
    if (!appointmentsOfProvider) {
      return null;
    }
    const updatedAppointmentList = [];
    for(let appointment of appointmentsOfProvider)
    {
      let status = appointment.status.toLowerCase();
      if (Date.parse(appointment.deadline) <= Date.now())
      {
        if(status === "approved")
        {
          await updateStatusOfAppointment("cancelled",appointment.id);
          status = "cancelled";
        }
        else if(status === "requested")
        {
          await updateStatusOfAppointment("cancelled", appointment.id);
          status = "cancelled";
        }
      }
      updatedAppointmentList.push({...appointment, status: status});
    }
    return updatedAppointmentList;
  } catch (err) {
    console.log('Fetch Appointments of Provider Error', err);
    return null;
  }
};

export const fetchAppointment = async (id) => {
  try {
    const appointment = await findAppointmentByAppointmentId(id);
    if (!appointment) {
      console.info('No appointment Found');
      return null;
    }
    return appointment;
  } catch (err) {
    console.log('Fetch appointment error', err);
    return null;
  }
};

export const fetchAndUpdateAppointment = async (id, data) => {
  try {
    const appointment = findAppointmentByAppointmentId(id);
    if (!appointment) {
      return null;
    }
    let updated = [];
    for (let key of Object.keys(data)) {
      let res;
      switch (key) {
        case 'status':
          res = await updateStatusOfAppointment(data[key], id);
          updated.push(res);
          break;
        case 'date':
          res = await updateDateOfAppointment(data[key], id);
          updated.push(res);
          break;
        default:
          break;
      }
    }
    return updated;
  } catch (err) {
    console.log('Fetch and Update Appointment Error', err);
    return null;
  }
};

export const fetchAndDeleteAppointment = async (id) => {
  try {
    const appointment = await findAndDeleteAppointment(id);
    if (!appointment) {
      return null;
    }
    return appointment;
  } catch (err) {
    console.log('Fetch and Delete Appointment Error', err);
    return null;
  }
};
