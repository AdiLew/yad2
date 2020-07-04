const _ = require('lodash');
const fetch = require('node-fetch');
const querystring = require('querystring');
const moment = require('moment');
const geolib = require('geolib');


moment.locale('he-IL');

const requestOptions = {
    headers: {
        //Chrome-like User agent compells Yad 2 return the response as a JSON for some reason.
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36'
    },
    method: 'GET'
}

const getApartmentsList = (filters) => {
    let endpoint = 'https://www.yad2.co.il/api/pre-load/getFeedIndex/realestate/rent'
    const query = querystring.stringify(filters)
    endpoint += _.isEmpty(filters) ? '' : `?${query}`

    /* */
    console.log(endpoint);
    /* */
    return fetch(endpoint, requestOptions)
        .then(res => res.json())
        .then(data => {
            const { total_items, feed_items } = _.get(data, 'feed');
            const apartments = feed_items
                .filter((i) => i.type === 'ad')
                .map((i) => cleanListItemObject(i))
                .sort((a, b) => {
                    return b.date_added.valueOf() - a.date_added.valueOf();
                })
            return { total_items, apartments };
        })

}


const getApartmenttDetails = (apptId) => {
    const endpoint = `https://www.yad2.co.il/api/item/${apptId}`

    return fetch(endpoint, requestOptions)
        .then(res => res.json())
        .then(json => cleanApptDrillData(json))
}

function cleanListItemObject(i) {
    try {
        const now = new moment()
        const data = {
            //Basic info
            square_meters: i.square_meters,
            price: i.price,
            Rooms_text: i.Rooms_text,
            Floor_text: i.Floor_text,
            TotalFloor_text: i.TotalFloor_text,
            HomeTypeID_text: i.HomeTypeID_text,
            yehidatdiur_text: i.yehidatdiur_text,
            PaymentInYear_text: i.PaymentInYear_text,
            date_of_entry: i.date_of_entry,
            Immediate_text: i.Immediate_text,
            AssetClassificationID_text: i.AssetClassificationID_text,
            //location
            coordinates: i.coordinates,
            address_home_number: i.address_home_number,
            street: i.street,
            neighborhood: i.neighborhood,
            city: i.city,
            //features,
            AirConditioner_text: i.AirConditioner_text,
            mamad_text: i.mamad_text,
            FairRent_text: i.FairRent_text,
            Furniture_text: i.Furniture_text,
            sunpatio_text: i.sunpatio_text,
            Amudim_text: i.Amudim_text,
            storeroom_text: i.storeroom_text,
            Parking_text: i.Parking_text,
            PetsInHouse_text: i.PetsInHouse_text,
            Grating_text: i.Grating_text,
            Elevator_text: i.Elevator_text,
            patio_text: i.patio_text,
            Meshupatz_text: i.Meshupatz_text,
            Porch_text: i.Porch_text,
            LongTerm_text: i.LongTerm_text,
            address_more: i.address_more,
            //images and videos,
            img_url: i.img_url,
            images: i.images,
            images_count: i.images_count,
            video_url: i.video_url,
            mp4_video_url: i.mp4_video_url,
            //ad details
            id: i.id,
            date_added: new moment(i.date_added, 'YYYY-MM-DD HH:mm:SS'),
            customer_id: i.customer_id,
            contact_name: i.contact_name,
            merchant: i.merchant,
            merchant_name: i.merchant_name,
            //kmFromOmris: parseFloat((geolib.getDistance(i.coordinates, { latitude: 32.072268, longitude: 34.779225 }) / 1000.0).toFixed(1)),
            adUrl: `https://www.yad2.co.il/s/c/${i.id}`
        }



        data.hoursSinceAdded = now.diff(data.date_added, 'hours')
        data.added = data.date_added.calendar();
        return data;
    }
    catch (err) {
        console.log(err)
        console.log(i);
        return;
    }
}

function cleanApptDrillData(i) {
    const infoBar = {}
    i.info_bar_items.forEach(k => infoBar[k.key] = isNaN(k.titleWithoutLabel) ? k.titleWithoutLabel : parseFloat(k.titleWithoutLabel))

    const data = {
        ...i,
        ...infoBar,
        added: new moment(i.date_added).calendar(),
        last_update: new moment(i.date_raw).calendar(),

        priceNum: ilsToNum(i.price),
        houseCommiteeNum: ilsToNum(i.HouseCommittee),
        propertyTaxNum: ilsToNum(i.property_tax),
        merchant_fees: i.merchant ? i.priceNum * 1.17 : 0,

    }
    data.MonthlyCostOfOwnersip = data.priceNum + data.houseCommiteeNum + (data.propertyTaxNum / 2) + (data.merchant_fees / 12)

    return data;

}
function ilsToNum(stValue) {
    if (_.isEmpty(stValue)) {
        return 0;
    }
    if (_.isNumber(stValue)) {
        return stValue;
    }
    return parseFloat(stValue.replace(/[\D]/g, "")) || 0;
}

module.exports = {
    getApartmentsList,
    getApartmenttDetails
}