import { motion } from "framer-motion";
import { Star, Award, Users, MessageSquare } from "lucide-react";

interface DoctorCardProps {
  name: string;
  specialty: string;
  hospital?: string;
  rating: number;
  reviews: number;
  patients: number;
  experience: number;
  photo?: string;
  delay?: number;
}

const DoctorCard = ({
  name,
  specialty,
  hospital,
  rating,
  reviews,
  patients,
  experience,
  photo,
  delay = 0,
}: DoctorCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white dark:bg-[#2A2A2A] rounded-xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#E2E2E2] dark:border-[#3A3A3A] transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center overflow-hidden">
            {photo ? (
              <img src={photo} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-xl font-bold">{name.charAt(0)}</span>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#3BB273] rounded-full flex items-center justify-center border-2 border-white dark:border-[#2A2A2A]">
            <Award className="w-3 h-3 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-[16px] font-semibold text-[#1E1E1E] dark:text-white mb-1">{name}</h3>
          <p className="text-[13px] text-[#6A6A6A] dark:text-[#9A9A9A] mb-2">{specialty}</p>
          {hospital && (
            <p className="text-[12px] text-[#6A6A6A] dark:text-[#9A9A9A]">{hospital}</p>
          )}
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />
            <span className="text-[14px] font-semibold text-[#1E1E1E] dark:text-white">{rating}</span>
            <span className="text-[12px] text-[#6A6A6A] dark:text-[#9A9A9A] ml-1">({reviews} reviews)</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E2E2E2] dark:border-[#3A3A3A]">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <p className="text-[12px] font-semibold text-[#1E1E1E] dark:text-white">{patients.toLocaleString()}</p>
          <p className="text-[11px] text-[#6A6A6A] dark:text-[#9A9A9A]">Patients</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Award className="w-4 h-4 text-primary" />
          </div>
          <p className="text-[12px] font-semibold text-[#1E1E1E] dark:text-white">{experience} Years</p>
          <p className="text-[11px] text-[#6A6A6A] dark:text-[#9A9A9A]">Experience</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <MessageSquare className="w-4 h-4 text-primary" />
          </div>
          <p className="text-[12px] font-semibold text-[#1E1E1E] dark:text-white">{reviews}</p>
          <p className="text-[11px] text-[#6A6A6A] dark:text-[#9A9A9A]">Reviews</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;

