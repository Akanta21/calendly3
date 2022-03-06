import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import { Button } from '@material-ui/core';


const ConfirmDialog = ({mined, showSign, transactionHash, setShowDialog, getData}) => {
    return <Dialog open={true}>
        <h3>
          {mined && 'Appointment Confirmed'}
          {!mined && !showSign && 'Confirming Your Appointment...'}
          {!mined && showSign && 'Please Sign to Confirm'}
        </h3>
        <div style={{textAlign: 'left', padding: '0px 20px 20px 20px'}}>
            {mined && <div>
              Your appointment has been confirmed and is on the blockchain.<br /><br />
              <a target="_blank" href={`https://ropsten.etherscan.io/tx/${transactionHash}`}>View on Etherscan</a>
              </div>}
          {!mined && !showSign && <div><p>Please wait while we confirm your appoinment on the blockchain....</p></div>}
          {!mined && showSign && <div><p>Please sign the transaction to confirm your appointment.</p></div>}
        </div>
        <div style={{textAlign: 'center', paddingBottom: '30px'}}>
        {!mined && <CircularProgress />}
        </div>
        {mined && 
        <Button onClick={() => {
            setShowDialog(false);
            getData();
          }
          }>Close</Button>}
      </Dialog>
    }
  
export default ConfirmDialog;