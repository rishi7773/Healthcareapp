const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { sendMail } = require('../utils/mailer');

// Runs every 30 minutes
const task = cron.schedule('*/30 * * * *', async() => {
    try {
        const now = new Date();
        const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        // Find appointments within next 24 hours and not yet reminded and not cancelled
        const appointments = await Appointment.find({
            appointmentDate: { $gte: now, $lte: next24h },
            reminderSent: false,
            status: { $ne: 'cancelled' }
        }).populate('patient doctor');

        if (!appointments.length) return;

        for (const appt of appointments) {
            const patientEmail = appt.patient && appt.patient.email ? appt.patient.email : null;
            const doctorEmail = appt.doctor && appt.doctor.email ? appt.doctor.email : null;

            const apptTime = appt.appointmentDate.toLocaleString();

            // send to patient
            if (patientEmail) {
                await sendMail({
                    to: patientEmail,
                    subject: `Appointment reminder: ${apptTime}`,
                    text: `Reminder: You have an appointment with Dr. ${appt.doctor.name} on ${apptTime}. Reason: ${appt.reason || 'N/A'}`,
                    html: `<p>Hi ${appt.patient.name},</p><p>This is a reminder for your appointment with Dr. ${appt.doctor.name} on <b>${apptTime}</b>.</p><p>Reason: ${appt.reason || 'N/A'}</p><p>Thanks,<br/>Healthcare App</p>`
                });
            }

            // send to doctor
            if (doctorEmail) {
                await sendMail({
                    to: doctorEmail,
                    subject: `Upcoming patient appointment: ${apptTime}`,
                    text: `Reminder: You have an appointment with patient ${appt.patient.name} on ${apptTime}.`,
                    html: `<p>Hi Dr. ${appt.doctor.name},</p><p>Reminder for appointment with patient <b>${appt.patient.name}</b> on <b>${apptTime}</b>.</p>`
                });
            }

            appt.reminderSent = true;
            await appt.save();
        }
    } catch (err) {
        console.error('Reminder job error:', err);
    }
}, {
    scheduled: false
});

module.exports = task;