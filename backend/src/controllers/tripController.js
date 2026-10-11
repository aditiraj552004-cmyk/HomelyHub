import {Property} from "../Models/propertyModel.js";

import {planTrip} from "../ai/tripPlanner.js";

import {generateDescription} from "../ai/generateDescription.js";

const cleanCity = (text) => text.trim().toLowerCase();
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createTripPlan = async (req, res) => {
  try {
    const { destination, budget, days, people, interests = [] } = req.body;
    const numericBudget = Number(budget);
    const numberOfDays = Number(days);
    const numberOfPeople = Number(people);

    if (
      typeof destination !== "string" ||
      !destination.trim() ||
      !Number.isFinite(numericBudget) || numericBudget <= 0 ||
      !Number.isInteger(numberOfDays) || numberOfDays <= 0 ||
      !Number.isInteger(numberOfPeople) || numberOfPeople <= 0 ||
      !Array.isArray(interests)
    ) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a destination, positive budget, number of days, number of people, and an interests list.",
      });
    }

    const plan = await planTrip({
      destination: destination.trim(),
      budget: numericBudget,
      days: numberOfDays,
      people: numberOfPeople,
      interests,
    });
    const perNight = numericBudget / numberOfDays;
    const city = escapeRegex(cleanCity(destination));
    const properties = await Property.find({
      $or: [
        { "address.city": { $regex: `^${city}$`, $options: "i" } },
        { "address.state": { $regex: `^${city}$`, $options: "i" } },
      ],
      pricePerNight: { $lte: perNight },
      maxGuests: { $gte: numberOfPeople },
    }).limit(6);

    res.status(200).json({
      status:"success",
      data:{plan,properties,perNight}
    })
  } catch (error) {
    console.error("Trip planning failed:", error);
    res.status(500).json({
      status:"fail",
      message:"Could not create a trip plan, please try again"
    })
  }
}

const writeDescription =async(req,res)=>{
try{
  const description =await generateDescription(req.body);

  res.status(200).json({status:"success",data:{description}})
}catch(error){
res.status(500).json({
  status:"fail",
  message:"Could not generate a description"
})
}
}
export {createTripPlan,writeDescription};
