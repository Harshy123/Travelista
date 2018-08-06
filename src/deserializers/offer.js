// @flow
import type { Offer } from '../models/Offer';
import type { RoomType } from '../models/RoomType';
import moment from 'moment';
// eslint-disable-next-line flowtype/no-weak-types
export function deserializeOffer(response: any): Promise<Offer> {
  return (
    Promise.resolve(response)
      // eslint-disable-next-line flowtype/no-weak-types
      .then((val: any) => {
        const roomTypePackages = val['room_type_packages'];
        // eslint-disable-next-line flowtype/no-weak-types
        const roomTypeInfos = roomTypePackages.map((roomTypePackage: any) => {
          const roomType = {
            id: roomTypePackage.room_type.id,
            name: roomTypePackage.room_type.name,
            description: roomTypePackage.room_type.description,
            addOns: roomTypePackage.room_type.facilities,
            startingFrom: roomTypePackage.nights * roomTypePackage.ratings.r1,
            capacity: roomTypePackage.room_type.capacity,
            ordering: roomTypePackage.room_type.ordering,
          };
          return {
            id: roomTypePackage.id,
            name: roomTypePackage.name,
            image: roomTypePackage.image,
            isSoldOut: roomTypePackage.is_sold_out,
            saveUpTo: roomTypePackage.save_up_to,
            nights: roomTypePackage.nights,
            startingFrom: roomTypePackage.nights * roomTypePackage.ratings.r1,
            roomType,
            ratings: roomTypePackage.ratings,
            addOns: roomTypePackage.add_ons,
            description: roomTypePackage.description,
          };
        });

        // eslint-disable-next-line flowtype/no-weak-types
        const experiences = val.hotel.experiences.map((experience: any) => {
          return {
            id: experience.id,
            name: experience.name,
          };
        });
        const hotelGroup = {
          id: val.hotel.hotel_group.id,
          slug: val.hotel.hotel_group.slug,
          name: val.hotel.hotel_group.name,
          image: val.hotel.hotel_group.image,
        };
        const roomTypes = roomTypeInfos
          // eslint-disable-next-line flowtype/no-weak-types
          .reduce((roomTypeInfos_: any, roomTypeInfo: any) => {
            if (
              roomTypeInfos_.filter(
                // eslint-disable-next-line flowtype/no-weak-types
                (roomTypeInfo_: any) =>
                  roomTypeInfo_.roomType.id === roomTypeInfo.roomType.id
              ).length >= 1
            ) {
              return roomTypeInfos_;
            } else {
              return roomTypeInfos_.concat(roomTypeInfo);
            }
          }, [])
          // eslint-disable-next-line flowtype/no-weak-types
          .map((roomTypeInfo: any) => {
            return roomTypeInfo.roomType;
          })
          .sort((a: RoomType, b: RoomType) => a.ordering - b.ordering);
        const hotel = {
          id: val.hotel.id,
          slug: val.hotel.slug,
          name: val.hotel.name,
          phoneNumber: val.hotel.phone_number,
          address: val.hotel.address,
          city: val.hotel.city,
          country: val.hotel.country,
          location: {
            lng: val.hotel.location_long,
            lat: val.hotel.location_lat,
          },
          about: val.hotel.about,
          whatWeLove: val.hotel.what_we_love,
          policy: val.hotel.policy,
          logo: val.hotel.logo,
          images: val.hotel.images,
          hotelGroup,
          experiences,
          hotelFacilities: val.hotel.facilities,
          roomTypes,
        };

        const roomTypeInfo = roomTypeInfos.reduce(
          // eslint-disable-next-line flowtype/no-weak-types
          (info: any, roomTypeInfo: any) => {
            const id = roomTypeInfo.roomType.id;
            const packageInfo = info[id] || {};
            // eslint-disable-next-line flowtype/no-weak-types
            const packages = packageInfo.packages || [];
            packages.push(roomTypeInfo);
            packageInfo.packages = packages;
            packageInfo.rates = roomTypeInfo.ratings;
            info[id] = packageInfo;
            return info;
          },
          {}
        );

        // eslint-disable-next-line flowtype/no-weak-types
        const minPrice = roomTypes.reduce((min: any, roomType: any) => {
          if (roomType.isSoldOut) {
            return min;
          }
          if (!min || min > roomType.startingFrom) {
            return roomType.startingFrom;
          }
          return min;
        }, undefined);

        return {
          id: val.id,
          price: minPrice,
          bookingStartAt: moment(val.booking_start_at),
          bookingEndAt: moment(val.booking_end_at),
          stayingStartAt: moment(val.staying_start_at),
          stayingEndAt: moment(val.staying_end_at),
          roomTypeInfo,
          hotel,
        };
      })
  );
}
