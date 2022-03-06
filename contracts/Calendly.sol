// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Calendly {
    uint rate;
    address payable owner;

    struct Appointment {
        string title;     // title of the meeting
        address attendee; // person you are meeting
        uint startTime;   // start time of meeting
        uint endTime;     // end time of the meeting
        uint amountPaid;  // amount paid for the meeting
    }

    Appointment[] appointments;

    constructor(){
        owner = payable(msg.sender);
    }

    function getRate() public view returns (uint) {
        return rate;
    }

    function setRate(uint _rate) public {
        require(msg.sender == owner, "Only owner can set rate");
        rate = _rate;
    }

    function getAppointments() public view returns (Appointment[] memory){
        return appointments;
    }

    function createAppointment(string memory title, uint startTime, uint endTime) public payable {
        Appointment memory appointment;

        appointment.title = title;
        appointment.startTime = startTime;
        appointment.endTime = endTime;
        appointment.amountPaid = ((endTime - startTime) / 60) * rate;
        appointment.attendee = msg.sender; // address of the person

        require(msg.value >= appointment.amountPaid, "Insufficient payment in ether"); // validation checks

        (bool success,) = owner.call{value: msg.value}(""); // send ETH to the owner
        require(success, "Failed to send Ether");

        appointments.push(appointment);
    }
}