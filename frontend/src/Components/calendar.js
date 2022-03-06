import { useState, useEffect } from 'react';

import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import { Scheduler, WeekView, Appointments, AppointmentForm } from '@devexpress/dx-react-scheduler-material-ui';

import { ethers } from 'ethers';
import contract from '../factory/contract'
import Admin from './Admin'
import ConfirmDialog from './ConfirmDialog'

const Calendar = ({account}) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [appointments, setAppointments] = useState([])
    const [showDialog, setShowDialog] = useState(false);
    const [showSign, setShowSign] = useState(false);
    const [mined, setMined] = useState(false);
    const [transactionHash, setTransactionHash] = useState("");

    const getData = async() => {
        const owner = await contract.owner();
        const rate = await contract.getRate();

        // ensuring that the metamask acct is the owner
        setIsAdmin(owner.toUpperCase() === account.toUpperCase())

        const appointmentData = await contract.getAppointments();

        transformAppointmentData(appointmentData);
    }

    const transformAppointmentData = (appointmentData) => {
      let data = [];
      appointmentData.forEach(appointment => {
        data.push({
          title: appointment.title,
          startDate: new Date(appointment.startTime * 1000),
          endDate: new Date(appointment.endTime * 1000),
        });
      });
  
      setAppointments(data);
    }


    const saveAppointment = async (data) => {
      const appointment = data.added;
      const title = appointment.title;
      const startTime = appointment.startDate.getTime() / 1000;
      const endTime = appointment.endDate.getTime() / 1000;
    
      setShowSign(true);
      setShowDialog(true);
      setMined(false);
    
      try {
          const rate = await contract.getRate();
          const rateInGwei = ethers.utils.formatEther(rate.toString())
          const cost = ((endTime - startTime) / 60) * (rateInGwei * 100)/100;
          const msg = {value: ethers.utils.parseEther(cost.toString())};
          let transaction = await contract.createAppointment(title, startTime, endTime, msg);
          
          setShowSign(false);
    
          await transaction.wait();
    
          setMined(true);
          setTransactionHash(transaction.hash);
      } catch (error) {
          console.log(error);
      }
    }
    
    useEffect(() => {
        getData()
    }, [])    

    return (
      <div className="container">
        {isAdmin && <Admin/>}
        <div id="calendar">
          <Scheduler data={appointments}>
            <ViewState />
            <EditingState  onCommitChanges={saveAppointment} />
            <IntegratedEditing />
            <WeekView  startDayHour={9} endDayHour={18.30} />
            <Appointments />
            <AppointmentForm />
          </Scheduler>
        </div>
        {
          showDialog && 
          <ConfirmDialog
            mined={mined} 
            showSign={showSign}
            transactionHash={transactionHash}
            setShowDialog={setShowDialog}
            getData={getData}
          />}
      </div>
   );
}

export default Calendar;