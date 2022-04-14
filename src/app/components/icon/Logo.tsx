import clsx from 'clsx'

const Logo = ({ className, ...props }: { className?: string }) => {
  return (
    <svg
      className={clsx('fill-current', className)}
      viewBox="0 0 1001 232"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M43.6949 228H0.170044V10.5276H43.6949V228Z"
        fill="currentColor"
      />
      <path
        d="M209.756 97.5772V138.827H82.3667V97.5772H209.756Z"
        fill="currentColor"
      />
      <path
        d="M410.85 10.5276L339.421 228H295.896L224.77 10.5276H274.21L317.583 155.661L361.108 10.5276H410.85Z"
        fill="currentColor"
      />
      <path
        d="M570.391 145.348C570.391 157.481 568.217 168.804 563.87 179.319C559.522 189.733 553.608 198.781 546.126 206.465C538.644 214.048 529.848 220.063 519.738 224.512C509.729 228.859 498.961 231.033 487.436 231.033C476.011 231.033 465.244 228.859 455.133 224.512C445.124 220.063 436.328 214.048 428.745 206.465C421.264 198.781 415.349 189.733 411.002 179.319C406.654 168.804 404.481 157.481 404.481 145.348C404.481 133.014 406.654 121.589 411.002 111.074C415.349 100.56 421.264 91.5111 428.745 83.9284C436.328 76.2445 445.124 70.2289 455.133 65.8815C465.244 61.5341 476.011 59.3603 487.436 59.3603C498.961 59.3603 509.729 61.4329 519.738 65.5782C529.848 69.6223 538.644 75.4357 546.126 83.0184C553.608 90.5 559.522 99.5487 563.87 110.165C568.217 120.679 570.391 132.407 570.391 145.348ZM528.686 145.348C528.686 138.676 527.574 132.66 525.349 127.302C523.226 121.842 520.294 117.191 516.553 113.349C512.812 109.406 508.415 106.424 503.359 104.402C498.405 102.279 493.097 101.217 487.436 101.217C481.774 101.217 476.415 102.279 471.36 104.402C466.406 106.424 462.059 109.406 458.318 113.349C454.678 117.191 451.797 121.842 449.674 127.302C447.551 132.66 446.489 138.676 446.489 145.348C446.489 151.617 447.551 157.43 449.674 162.789C451.797 168.147 454.678 172.798 458.318 176.741C462.059 180.684 466.406 183.818 471.36 186.143C476.415 188.368 481.774 189.48 487.436 189.48C493.097 189.48 498.405 188.418 503.359 186.295C508.415 184.172 512.812 181.189 516.553 177.347C520.294 173.506 523.226 168.855 525.349 163.395C527.574 157.936 528.686 151.92 528.686 145.348Z"
        fill="currentColor"
      />
      <path
        d="M673.516 228C663.506 228 654.104 226.13 645.308 222.389C636.512 218.547 628.778 213.34 622.105 206.768C615.533 200.096 610.326 192.361 606.484 183.565C602.744 174.769 600.873 165.367 600.873 155.358V107.131H580.703V65.8815H600.873V0.973389H642.123V65.8815H704.908V107.131H642.123V155.358C642.123 159.705 642.932 163.8 644.55 167.642C646.167 171.382 648.392 174.668 651.222 177.499C654.053 180.33 657.39 182.605 661.232 184.324C665.073 185.941 669.168 186.75 673.516 186.75H704.908V228H673.516Z"
        fill="currentColor"
      />
      <path
        d="M792.868 188.267C794.485 188.772 796.103 189.126 797.721 189.328C799.338 189.429 800.956 189.48 802.573 189.48C806.618 189.48 810.51 188.924 814.251 187.812C817.992 186.699 821.48 185.132 824.715 183.11C828.051 180.987 830.983 178.46 833.511 175.528C836.14 172.495 838.263 169.158 839.88 165.518L870.211 196.001C866.369 201.461 861.921 206.364 856.866 210.711C851.912 215.059 846.503 218.749 840.639 221.782C834.876 224.815 828.759 227.09 822.289 228.607C815.919 230.224 809.347 231.033 802.573 231.033C791.149 231.033 780.381 228.91 770.271 224.664C760.262 220.417 751.466 214.503 743.883 206.92C736.402 199.337 730.487 190.339 726.14 179.926C721.792 169.411 719.619 157.885 719.619 145.348C719.619 132.508 721.792 120.78 726.14 110.165C730.487 99.5487 736.402 90.5 743.883 83.0184C751.466 75.5368 760.262 69.7234 770.271 65.5782C780.381 61.4329 791.149 59.3603 802.573 59.3603C809.347 59.3603 815.97 60.1692 822.44 61.7868C828.911 63.4045 835.028 65.7298 840.79 68.7629C846.654 71.796 852.114 75.5368 857.169 79.9853C862.224 84.3328 866.673 89.2362 870.515 94.6958L792.868 188.267ZM814.099 102.885C812.178 102.177 810.257 101.722 808.336 101.52C806.517 101.318 804.596 101.217 802.573 101.217C796.912 101.217 791.553 102.279 786.498 104.402C781.544 106.424 777.197 109.356 773.456 113.198C769.816 117.04 766.935 121.69 764.812 127.15C762.688 132.508 761.627 138.574 761.627 145.348C761.627 146.865 761.677 148.584 761.778 150.505C761.981 152.426 762.233 154.397 762.537 156.419C762.941 158.34 763.396 160.211 763.902 162.03C764.407 163.85 765.064 165.468 765.873 166.883L814.099 102.885Z"
        fill="currentColor"
      />
      <path
        d="M932.845 228H891.443V65.5782H901.452L915.101 84.8383C921.774 78.7721 929.357 74.1214 937.849 70.8861C946.342 67.5497 955.138 65.8815 964.237 65.8815H1000.79V107.131H964.237C959.89 107.131 955.795 107.94 951.953 109.558C948.111 111.176 944.775 113.4 941.944 116.231C939.113 119.062 936.889 122.398 935.271 126.24C933.653 130.082 932.845 134.176 932.845 138.524V228Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default Logo