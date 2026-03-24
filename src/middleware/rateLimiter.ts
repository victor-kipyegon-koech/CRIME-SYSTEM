import { RateLimiterMemory } from "rate-limiter-flexible";
import { NextFunction,Request,Response } from "express";

const rateLimiter = new RateLimiterMemory({
    points: 100, //numbers of requests
    duration: 60 //Per second
})

export const rateLimiterMiddleware = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        await rateLimiter.consume(req.ip || 'unkown');
        console.log(`Rate Limit check passed for IP: ${req.ip})`)
        next()
    } catch (error) {
        res.status(429).json({error:"Too many request, please try again later."})
    }
}