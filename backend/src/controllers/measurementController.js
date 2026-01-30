import Measurement from '../models/Measurement.js';

export const createOrUpdateMeasurement = async (req, res, next) => {
  try {
    const {
      height,
      weight,
      chest,
      waist,
      hips,
      shoulderWidth,
      sleeveLength,
      inseam,
      neckCircumference,
      notes,
    } = req.body;

    let measurement = await Measurement.findOne({ user: req.user.id });

    if (measurement) {
      // Update existing measurement
      measurement = await Measurement.findOneAndUpdate(
        { user: req.user.id },
        {
          height,
          weight,
          chest,
          waist,
          hips,
          shoulderWidth,
          sleeveLength,
          inseam,
          neckCircumference,
          notes,
        },
        { new: true, runValidators: true }
      );
    } else {
      // Create new measurement
      measurement = await Measurement.create({
        user: req.user.id,
        height,
        weight,
        chest,
        waist,
        hips,
        shoulderWidth,
        sleeveLength,
        inseam,
        neckCircumference,
        notes,
      });
    }

    res.status(200).json({
      success: true,
      data: measurement,
    });
  } catch (error) {
    next(error);
  }
};

export const getMeasurement = async (req, res, next) => {
  try {
    const measurement = await Measurement.findOne({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: measurement,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMeasurements = async (req, res, next) => {
  try {
    const measurements = await Measurement.find().populate(
      'user',
      'firstName lastName email phone'
    );

    res.status(200).json({
      success: true,
      count: measurements.length,
      data: measurements,
    });
  } catch (error) {
    next(error);
  }
};