import React, {ComponentType} from 'react'
import Home from './Home';
import Mail from './Mail';
import Lock from './Lock';
import User from './User';
import Heart from './Heart';
import Plus from './Plus';
import Search from './Search';
import Location from './Location';
import Call from './Call';
import {theme} from '@/constants/theme';
import Camera from './Camera';
import Edit from './Edit';
import ArrowLeft from './ArrowLeft';
import ThreeDotsCircle from './ThreeDotsCircle';
import ThreeDotsHorizontal from './ThreeDotsHorizontal';
import Comment from './Comment';
import Share from './Share';
import Send from './Send';
import Delete from './Delete';
import Logout from './logout';
import Image from './Image';
import Video from './Video';
import Star from './Star';
import CleeksIcon from './CleeksIcon';
import Bio from './Bio';

const icons:{ [key: string]: ComponentType<any> } = {
    home: Home,
    mail: Mail,
    lock: Lock,
    user: User,
    heart: Heart,
    plus: Plus,
    search: Search,
    location: Location,
    call: Call,
    camera: Camera,
    edit: Edit,
    arrowLeft: ArrowLeft,
    threeDotsCircle: ThreeDotsCircle,
    threeDotsHorizontal: ThreeDotsHorizontal,
    comment: Comment,
    share: Share,
    send: Send,
    delete: Delete,
    logout: Logout,
    image: Image,
    video: Video,
    star: Star,
    cleeks: CleeksIcon,
    bio: Bio,
}

interface IconProps {
    name: keyof typeof icons;
    size?: number;
    strokeWidth?: number;
    color?:any;
    fill?: any;
}

const Icon = ({ name, size = 24, strokeWidth = 1.9, color, fill, ...props }: IconProps) => {
    const IconComponent = icons[name];
  return (
    <IconComponent
        height={size || 24}
        width={size || 24}
        strokeWidth={strokeWidth || 1.9}
        color={color|| theme.colors.textLight}
        fill={fill || "none"}
        {...props}
    />
  )
}

export default Icon;
