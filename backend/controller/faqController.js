import FAQ from '../models/faqModel.js';

//Get all FAQs (sorted by most popular)
export const getFAQs = async(req, res) => {
    try{
        const faqs = await FAQ.find().sort({views: -1});// Sort FAQs by views (most popular first)
        res.json(faqs);
    }catch(error){
        res.status(500).json({message: "Error in fetching faqs", error: error.message});
    }
};

//Add a new FAQ
export const addFAQ = async(req, res) => {
    try{
        const {question, answer} = req.body;
        const newFAQ = new FAQ({question, answer});
        await newFAQ.save();
        res.status(201).json(newFAQ);
    }catch(error){
        res.status(500).json({message: "Error in adding faq", error: error.message})
    }
};

//Update an existing FAQ
export const updateFAQ = async(req, res) => {
    try{
        const {id} = req.params;
        const {question, answer} = req.body;
        const updatedFAQ = await FAQ.findByIdAndUpdate(id, {question, answer}, {new: true});

        if(!updatedFAQ){
            return res.status(404).json({message: "FAQ not found"});
        }

        res.json(updatedFAQ);
    }catch(error){
        res.status(500).json({message: "Error in updating FAQ", error: error.message});
    }
};

//Delete an FAQ
export const deleteFAQ = async(req, res) => {
    try{
        const {id} = req.params;
        await FAQ.findByIdAndDelete(id);
        res.json({message: "FAQ deleted successfully"});
    }catch(error){
        res.status(500).json({message: "Error in deleting FAQ", error: error.message});
    }
};

//Increment FAQ Views
export const incrementFAQViews = async(req, res) => {
    try{
        const {id} = req.params;
        const faq = await FAQ.findByIdAndUpdate(id, {$inc: {views: 1}}, {new: true});

        if(!faq){
            return res.status(404).json({message: "FAQ not found"});
        }

        res.json(faq);
    }catch(error){
        res.status(500).json({ message: "Error updating FAQ views", error: error.message });
    }
}