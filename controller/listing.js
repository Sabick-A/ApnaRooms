const Listing = require("../models/listing.js");

module.exports.index=async (req, res) => {
    let listings = await Listing.find({});
    res.render("./listings/index.ejs", { listings });
}

module.exports.createListingForm=(req, res) => {
    res.render("./listings/newListing.ejs");
};

module.exports.createListing=async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = res.locals.currUser._id;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

module.exports.showListings=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate('owner').populate({
        path:"reviews",
        populate:{
            path: "author",
        }
    });
    if (!listing) {
        req.flash("error", "Listing Does Not Exist");
        res.redirect("/listings");
    }
    res.render("./listings/listing.ejs", { listing });
};

module.exports.updateListingForm=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash("error", "Listing Does Not Exist");
        res.redirect("/listings")
    }
    res.render("./listings/editListing.ejs", { listing });
};

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("done");
    req.flash("success", "Listing Deleted");
   
    res.redirect("/listings");
};