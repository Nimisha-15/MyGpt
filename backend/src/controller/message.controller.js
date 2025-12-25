const axios = require("axios")
const chatModel = require("../models/chat.model")
const userModel = require("../models/user.model")
const imagekit = require("../config/imagekit")
const openai = require("../config/openai")



const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id
    const { chatId, prompt } = req.body

    if (!chatId || !prompt) {
      return res.status(400).json({ message: "chatId or prompt missing" })
    }

    if (req.user.credits < 1) {
      return res.status(403).json({ message: "Not enough credits" })
    }

    const chat = await chatModel.findOne({
      _id: chatId,
      userId: userId
    })

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" })
    }

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false
    })

    const response = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }]
    })

    const reply = {
      role: "assistant",
      content: response.choices[0].message.content,
      timestamp: Date.now(),
      isImage: false
    }

    chat.messages.push(reply)
    await chat.save()

    await userModel.updateOne(
      { _id: userId },
      { $inc: { credits: -1 } }
    )

    return res.status(200).json({ reply })

  } catch (error) {
    console.error("text message error:", error)
    return res.status(500).json({ message: "error in text message" })
  }
}

// Image Generation message controller --->
const imageMessageController = async (req , res)=>{
    try {
        const userId = req.user._id
        if(req.user.credits< 2){
            return res.status(404).json({
                message :"Credits is less than 2 "
            })
        }
        const {prompt , chatId , isPublished} = req.body

        // find chat 
        const chat = await chatModel.findOne({userId , _id:chatId})

        //push user message
        chat.messages.push({role : "user" ,
             content : prompt ,
             timestamp : Date.now(),
             isImage :false})

        // encode prompt
        const encodedPrompt = encodeURIComponent(prompt)

        //Construct ImageKit AI Generation URl 
        const generatedImageURL = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/mygpt/${Date.now()}.png?tr=w-800,h-800`
        //trigger genneration by fetching from imagekit 
        const aiImageResponse = await axios.get(generatedImageURL , {
            responseType : "arraybuffer"
        })

        // convert to base64
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data,"binary").toString('base64')}`;

        //Upload to imageKit media library
        const uploadResponse = await imagekit.upload({
            file : base64Image,
            fileName : `${Date.now()}.png`,
            folder : "MyGpt"
        })

        const reply = {
            role :"assistant ",
            content : uploadResponse.url,
            timestamp : Date.now(),
            isImage :true,
            isPublished  }
            
        res.status(200).json({
            message : "message starts",
            reply : reply,
        });

        chat.messages.push(reply)
        await chat.save()
        await userModel.updateOne({_id : userId} , {$inc : {credits : -2 }})

    } catch (error) {
        console.log("error in image message controller --->" , error )
        res.status(403).json({
            message :"error found in image generation"
        })
    }
}

module.exports = {
    textMessageController,
    imageMessageController
}