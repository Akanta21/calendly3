import { ethers } from 'ethers';
import abi from '../abis/Calendly.json';

const contractAddress = "0x3333E3e8b1eF83C5c72BB9911Ec222E4ac7cc843"
const contractABI = abi.abi;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract(contractAddress, contractABI, provider.getSigner());

export default contract