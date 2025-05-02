import React from "react";
import "./style.scss";
import { Card } from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function PowerBy() {
  return (
    <>
      <div className="w-full min-h-[264px] overflow-hidden flex justify-center items-center relative z-1">
        {/* SVG vẽ CPU animation */}
        <svg
          fill="none"
          height="264"
          role="img"
          className="absolute top-0"
          viewBox="0 0 891 264"
          width="891"
          data-lines="true"
          aria-label="A bunch of connecting lines that form into the CPU, with the text Powered By on top of the CPU. Gradient lines are animating along the drawn lines, dissolving into the CPU in the center."
        >
          <path
            d="M388 96L388 68C388 65.7909 386.209 64 384 64L310 64"
            stroke="#fff"
            strokeOpacity="0.1"
            pathLength="1"
            strokeDashoffset="0px"
            strokeDasharray="1px 1px"
          />
          <path
            d="M349 150L73 150C70.7909 150 69 151.791 69 154L69 174"
            stroke="#fff"
            strokeOpacity="0.1"
            pathLength="1"
            strokeDashoffset="0px"
            strokeDasharray="1px 1px"
          />
          <g>
            <path
              d="M547 130L822 130C824.209 130 826 131.791 826 134L826 264"
              stroke="#fff"
              strokeOpacity="0.1"
              pathLength="1"
              strokeDashoffset="0px"
              strokeDasharray="1px 1px"
            />
            <path
              d="M547 130L822 130C824.209 130 826 131.791 826 134L826 264"
              stroke="url(#orange-pulse-1)"
              strokeWidth="2"
            />
          </g>
          <g>
            <path
              d="M349 130L5.00002 130C2.79088 130 1.00001 131.791 1.00001 134L1.00001 264"
              stroke="#fff"
              strokeOpacity="0.1"
              pathLength="1"
              strokeDashoffset="0px"
              strokeDasharray="1px 1px"
            />
            <path
              d="M349 130L5.00002 130C2.79088 130 1.00001 131.791 1.00001 134L1.00001 264"
              stroke="url(#blue-pulse-1)"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </g>
          <g>
            <path
              d="M547 150L633 150C635.209 150 637 151.791 637 154L637 236C637 238.209 635.209 240 633 240L488 240C485.791 240 484 241.791 484 244L484 264"
              stroke="#fff"
              strokeOpacity="0.1"
              pathLength="1"
              strokeDashoffset="0px"
              strokeDasharray="1px 1px"
            />
            <path
              d="M547 150L633 150C635.209 150 637 151.791 637 154"
              stroke="url(#pink-pulse-2)"
              strokeLinecap="round"
              strokeWidth="2"
            />
            <path
              d="M637 154L637 236C637 238.209 635.209 240 633 240L488 240C485.791 240 484 241.791 484 244L484 264"
              stroke="url(#pink-pulse-2-up-left)"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </g>
          <g>
            <path
              d="M388 184L388 194C388 196.209 386.209 198 384 198L77 198C74.7909 198 73 199.791 73 202L73 264"
              stroke="#fff"
              strokeOpacity="0.1"
              pathLength="1"
              strokeDashoffset="0px"
              strokeDasharray="1px 1px"
            />
            <path
              d="M388 184L388 194C388 196.209 386.209 198 384 198L77 198C74.7909 198 73 199.791 73 202L73 264"
              stroke="url(#blue-pulse-2)"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </g>
          <path
            d="M412 96L412 0"
            stroke="url(#paint0_linear_341_27683)"
            strokeOpacity="0.1"
            pathLength="1"
            strokeDashoffset="0px"
            strokeDasharray="1px 1px"
          />

          {/* 
        Gói path cần transform scale(-1) vào <g> 
        và áp style để React bắt được. 
      */}
          <g
            style={{
              transform: "scale(-1)",
              transformOrigin: "412px 223.75px",
              transformBox: "fill-box",
            }}
          >
            <path
              d="M412 263.5L412 184"
              stroke="#fff"
              strokeOpacity="0.1"
              pathLength="1"
              strokeDashoffset="0px"
              strokeDasharray="1px 1px"
            />
            <path
              d="M412 263.5L412 184"
              stroke="url(#pink-pulse-2)"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </g>

          <g>
            <path
              d="M508 96L508 88C508 85.7909 509.791 84 512 84L886 84C888.209 84 890 85.7909 890 88L890 264"
              stroke="#fff"
              strokeOpacity="0.1"
              pathLength="1"
              strokeDashoffset="0px"
              strokeDasharray="1px 1px"
            />
            <path
              d="M508 96L508 88C508 85.7909 509.791 84 512 84L886 84C888.209 84 890 85.7909 890 88L890 264"
              stroke="url(#orange-pulse-2)"
              strokeWidth="2"
            />
          </g>
          <path
            d="M436 96L436 0"
            stroke="url(#paint1_linear_341_27683)"
            strokeOpacity="0.1"
            pathLength="1"
            strokeDashoffset="0px"
            strokeDasharray="1px 1px"
          />

          {/* Tương tự, bọc path để xoay */}
          <g
            style={{
              transform: "scale(-1)",
              transformOrigin: "436px 199px",
              transformBox: "fill-box",
            }}
          >
            <path
              d="M436 214L436 184"
              stroke="#fff"
              strokeOpacity="0.1"
              pathLength="1"
              strokeDashoffset="0px"
              strokeDasharray="1px 1px"
            />
          </g>

          <path
            d="M460 96L460 64"
            stroke="#fff"
            strokeOpacity="0.1"
            pathLength="1"
            strokeDashoffset="0px"
            strokeDasharray="1px 1px"
          />

          {/* Lại bọc để xoay */}
          <g
            style={{
              transform: "scale(-1)",
              transformOrigin: "460px 211.5px",
              transformBox: "fill-box",
            }}
          >
            <path
              d="M460 239L460 184"
              stroke="#fff"
              strokeOpacity="0.1"
              pathLength="1"
              strokeDashoffset="0px"
              strokeDasharray="1px 1px"
            />
          </g>

          <path
            d="M484 96L484 24C484 21.7909 485.791 20 488 20L554 20"
            stroke="url(#paint2_linear_341_27683)"
            strokeOpacity="0.1"
            pathLength="1"
            strokeDashoffset="0px"
            strokeDasharray="1px 1px"
          />
          <path
            d="M484 184L484 210C484 212.209 485.791 214 488 214L560 214"
            stroke="#fff"
            strokeOpacity="0.1"
            pathLength="1"
            strokeDashoffset="0px"
            strokeDasharray="1px 1px"
          />
          <path
            d="M508 184L508 193C508 195.209 509.791 197 512 197L560 197"
            stroke="#fff"
            strokeOpacity="0.1"
            pathLength="1"
            strokeDashoffset="0px"
            strokeDasharray="1px 1px"
          />
          <circle cx="460" cy="64" fill="var(--geist-background)" r="4" opacity="1" />
          <circle cx="460" cy="64" r="3.5" stroke="#fff" strokeOpacity="0.1" opacity="1" />
          <circle cx="308" cy="64" fill="var(--geist-background)" r="4" opacity="1" />
          <circle cx="308" cy="64" r="3.5" stroke="#fff" strokeOpacity="0.1" opacity="1" />
          <circle cx="69" cy="173" fill="var(--geist-background)" r="4" opacity="1" />
          <circle cx="69" cy="173" r="3.5" stroke="#fff" strokeOpacity="0.1" opacity="1" />
          <circle cx="436" cy="214" fill="var(--geist-background)" r="4" opacity="1" />
          <circle cx="436" cy="214" r="3.5" stroke="#fff" strokeOpacity="0.1" opacity="1" />
          <circle cx="460" cy="240" fill="var(--geist-background)" r="4" opacity="1" />
          <circle cx="460" cy="240" r="3.5" stroke="#fff" strokeOpacity="0.1" opacity="1" />
          <circle cx="560" cy="214" fill="var(--geist-background)" r="4" opacity="1" />
          <circle cx="560" cy="214" r="3.5" stroke="#fff" strokeOpacity="0.1" opacity="1" />
          <circle cx="560" cy="197" fill="var(--geist-background)" r="4" opacity="1" />
          <circle cx="560" cy="197" r="3.5" stroke="#fff" strokeOpacity="0.1" opacity="1" />
          <defs>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="paint0_linear_341_27683"
              x1="412.5"
              x2="412.5"
              y1="-3.27835e-08"
              y2="96"
            >
              <stop stopOpacity="0" />
              <stop offset="1" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="paint1_linear_341_27683"
              x1="436.5"
              x2="436.5"
              y1="-3.27835e-08"
              y2="96"
            >
              <stop stopOpacity="0" />
              <stop offset="1" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="paint2_linear_341_27683"
              x1="554"
              x2="484"
              y1="20"
              y2="96"
            >
              <stop stopOpacity="0" />
              <stop offset="1" />
            </linearGradient>

            {/* ======================== BLUE PULSE 1 ======================== */}
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="blue-pulse-1"
              x1="283.4238068377308"
              y1="170.15633368914132"
              x2="251.81121900843573"
              y2="237.17919346021517"
            >
              <stop stopColor="#2EB9DF" stopOpacity="0" />
              <stop offset="0.05" stopColor="#2EB9DF" />
              <stop offset="1" stopColor="#2EB9DF" stopOpacity="0" />
              {/* Animate the gradient by translating (lặp vô hạn) */}
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                from="-400 0"
                to="800 0"
                dur="3s"
                repeatCount="indefinite"
              />
            </linearGradient>

            {/* ======================== BLUE PULSE 2 ======================== */}
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="blue-pulse-2"
              x1="156.82243188892608"
              y1="224.53394737064082"
              x2="145.17851518720272"
              y2="261.28397696676984"
            >
              <stop stopColor="#2EB9DF" stopOpacity="0" />
              <stop offset="0.05" stopColor="#2EB9DF" />
              <stop offset="1" stopColor="#2EB9DF" stopOpacity="0" />
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                from="-100 0"
                to="600 0"
                dur="2s"
                repeatCount="indefinite"
              />
            </linearGradient>

            {/* ======================== PINK PULSE 1 ======================== */}
            {/* <linearGradient
          gradientUnits="userSpaceOnUse"
          id="pink-pulse-1"
          x1="400"
          y1="83"
          x2="350"
          y2="133.75"
        >
          <stop stopColor="#FF4A81" stopOpacity="0" />
          <stop offset="0.03" stopColor="#FF4A81" />
          <stop offset="0.27" stopColor="#DF6CF6" />
          <stop offset="1" stopColor="#0196FF" stopOpacity="0" />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            from="-100 0"
            to="200 0"
            dur="3s"
            repeatCount="indefinite"
          />
        </linearGradient> */}

            {/* ======================== PINK PULSE 2 ======================== */}
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="pink-pulse-2"
              x1="547"
              y1="150"
              x2="637"
              y2="154"
            >
              <stop stopColor="#3ECF8E" stopOpacity="0" />
              <stop offset="0.1" stopColor="#3ECF8E" />
              <stop offset="0.3" stopColor="#7EE7B2" />
              <stop offset="0.5" stopColor="#0196FF" stopOpacity="0" />
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                from="120 0"
                to="-40 0"
                dur="2s"
                repeatCount="indefinite"
              />
            </linearGradient>
            {/* Gradient cho phần ngang và rẽ trái */}
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="pink-pulse-2-up-left"
              x1="637"
              y1="104"
              x2="547"
              y2="164"
            >
              <stop stopColor="#3ECF8E" stopOpacity="0" />
              <stop offset="0.1" stopColor="#3ECF8E" />
              <stop offset="0.3" stopColor="#7EE7B2" />
              <stop offset="0.5" stopColor="#0196FF" stopOpacity="0" />
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                from="-250 0"
                to="700 0"
                dur="2s"
                repeatCount="indefinite"
              />
            </linearGradient>

            {/* ======================== ORANGE PULSE 1 ======================== */}
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="orange-pulse-1"
              x1="50"
              x2="80"
              y1="258.98522880335804"
              y2="326.6249206897919"
            >
              <stop stopColor="#FF7432" stopOpacity="0" />
              <stop offset="0.2" stopColor="#FF7432" />
              <stop offset="0.6" stopColor="#F7CC4B" />
              <stop offset="1" stopColor="#F7CC4B" stopOpacity="0" />
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                from="800 0"
                to="-800 0"
                dur="3s"
                repeatCount="indefinite"
              />
            </linearGradient>

            {/* ======================== ORANGE PULSE 2 ======================== */}
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="orange-pulse-2"
              x1="300"
              y1="140"
              x2="400"
              y2="180"
            >
              <stop stopColor="#FF7432" stopOpacity="0" />
              <stop offset="0.0531089" stopColor="#FF7432" />
              <stop offset="0.415114" stopColor="#F7CC4B" />
              <stop offset="1" stopColor="#F7CC4B" stopOpacity="0" />
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                from="800 0"
                to="-800 0"
                dur="3s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>
        </svg>
        {/* The connector of the CPU */}
        <div className="relative px-6 py-5 cpu z-1">
          <div className="shine absolute w-full h-full"></div>
          <div className="connector absolute flex flex-col gap-4">
            <span className="item"></span>
            <span className="item"></span>
          </div>
          <div className="connector right-side absolute flex flex-col gap-4">
            <span className="item"></span>
            <span className="item"></span>
          </div>
          <div className="connector top-side absolute flex gap-4 justify-center">
            <span className="item"></span>
            <span className="item"></span>
            <span className="item"></span>
            <span className="item"></span>
            <span className="item"></span>
            <span className="item"></span>
          </div>
          <div className="connector bottom-side absolute flex gap-4 justify-center">
            <span className="item"></span>
            <span className="item"></span>
            <span className="item"></span>
            <span className="item"></span>
            <span className="item"></span>
          </div>
          <span className="data-text text-white text-2xl font-bold">Powered By</span>
        </div>
      </div>
      <div className="flex gap-8 max-w-[1200px] mx-auto">
        <Card className="w-1/3 min-h-[240px]  rounded-lg p-6 item relative flex flex-col justify-between ">
          <Image src="/assets/images/react-logo.png" alt="react-logo" width={40} height={40} />
          <div className="flex flex-col gap-2">
            <Link
              href="https://react.dev/"
              target="_blank"
              className="font-semibold text-xl flex gap-2 items-center"
              rel="noopener noreferrer"
            >
              React
              <ArrowUpRight className="ml-1 h-6 w-6" />
            </Link>
            <span className="text-sm text-gray-500">
              The library for web and native user interfaces. Next.js is built on the latest React
              features, including Server Components and Actions.
            </span>
          </div>
        </Card>
        <Card className="w-1/3 min-h-[240px]  rounded-lg p-6 item relative flex flex-col justify-between ">
          <Image
            src="/assets/images/supabase-logo-icon.png"
            alt="react-logo"
            width={40}
            height={40}
          />
          <div className="flex flex-col gap-2">
            <Link
              href="https://supabase.com/"
              target="_blank"
              className="font-semibold text-xl flex gap-2 items-center"
              rel="noopener noreferrer"
            >
              Supabase
              <ArrowUpRight className="ml-1 h-6 w-6" />
            </Link>
            <span className="text-sm text-gray-500">
              Open-source Firebase alternative. Built-in Auth, Realtime DB, and PostgreSQL.
            </span>
          </div>
        </Card>
        <Card className="w-1/3 min-h-[240px]  rounded-lg p-6 item relative flex flex-col justify-between ">
          <Image src="/assets/images/wordpress.png" alt="react-logo" width={40} height={40} />
          <div className="flex flex-col gap-2">
            <Link
              href="https://wordpress.com/"
              target="_blank"
              className="font-semibold text-xl flex gap-2 items-center"
              rel="noopener noreferrer"
            >
              Wordpress
              <ArrowUpRight className="ml-1 h-6 w-6" />
            </Link>
            <span className="text-sm text-gray-500">
              The most popular CMS. Power your site with themes and plugins.
            </span>
          </div>
        </Card>
      </div>
    </>
  );
}
