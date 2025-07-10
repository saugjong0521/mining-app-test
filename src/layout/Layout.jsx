import { useEffect, useState, useRef } from "react";
import { useUserBalanceStore } from "@/store";

const getRandomColors = () => {
    const pick = () => COLORS[Math.floor(Math.random() * COLORS.length)];
    return [pick(), pick(), pick(), pick()];
};

const COLORS = [
    "#f87171", "#fb923c", "#facc15", "#4ade80", "#34d399",
    "#22d3ee", "#60a5fa", "#a78bfa", "#f472b6", "#c084fc"
];

const Layout = () => {
    const [count, setCount] = useState(0);
    const { balance, setBalance } = useUserBalanceStore();

    const [outerSize, setOuterSize] = useState(125);
    const [innerSize, setInnerSize] = useState(112);

    const [scale, setScale] = useState({ x: 1, y: 1 });

    const [currColors, setCurrColors] = useState(getRandomColors());
    const [prevColors, setPrevColors] = useState(currColors);
    const [fading, setFading] = useState(false);

    // 마이닝 카운트
    useEffect(() => {
        const miningInterval = setInterval(() => {
            setCount((prev) => parseFloat((prev + 0.001).toFixed(3)));
        }, 100);
        return () => clearInterval(miningInterval);
    }, []);

    // 크기 애니메이션 부드럽게
    useEffect(() => {
        let start = performance.now();
        const animate = (time) => {
            const elapsed = time - start;
            const outerRange = 7.5; // 120~135px 범위
            const innerRange = 3;   // 110~116px 범위

            const outerCenter = 127.5; // 평균값
            const innerCenter = 113;

            // sin 함수를 이용한 부드러운 변동
            setOuterSize(outerCenter + outerRange * Math.sin(elapsed / 1000));
            setInnerSize(innerCenter + innerRange * Math.sin(elapsed / 1200));

            requestAnimationFrame(animate);
        };

        const frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, []);


    // 색상 전환 애니메이션
    useEffect(() => {
        const colorInterval = setInterval(() => {
            setFading(true);
            setTimeout(() => {
                setPrevColors(currColors);
                setCurrColors(getRandomColors());
                setFading(false);
            }, 2000);
        }, 6000);
        return () => clearInterval(colorInterval);
    }, [currColors]);

    const handleClaim = () => {
        const total = parseFloat((balance + count).toFixed(3));
        setBalance(total);
        setCount(0);
    };

    return (
        <div className="flex justify-center max-w-[360px] max-h-[500px] w-full h-full py-8">
            <div className="flex flex-col justify-between h-full w-full gap-[20px]">
                <div>
                    <p className="text-[24px] text-white font-bold">Mining App</p>
                    <p className="text-[20px] text-white">{count.toFixed(3)}</p>
                </div>

                <div>
                    <p className="text-white">Current speed: x1</p>
                </div>

                <div className="flex flex-col gap-[20px] w-full h-full justify-center items-center">
                    <div className="flex flex-col w-full h-[120px] justify-center items-center">
                        <div
                            className="relative flex items-center justify-center"
                            style={{
                                width: `${outerSize}px`,
                                height: `${outerSize}px`,
                                transform: `scale(${scale.x}, ${scale.y})`,
                                transition: "transform 0.1s ease-in-out"
                            }}
                        >
                            {/* 이전 색상 레이어 */}
                            <div
                                className="absolute rounded-full transition-opacity duration-[2000ms] animate-spin-slow"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    background: `linear-gradient(135deg, ${prevColors[0]}, ${prevColors[1]}, ${prevColors[2]})`,
                                    opacity: fading ? 1 : 0,
                                }}
                            />
                            {/* 현재 색상 레이어 */}
                            <div
                                className="absolute rounded-full transition-opacity duration-[2000ms] animate-spin-slow"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    background: `linear-gradient(135deg, ${currColors[1]}, ${currColors[2]}, ${currColors[3]})`,
                                    opacity: fading ? 0 : 1,
                                }}
                            />
                            {/* 안쪽 검은 원 */}
                            <div
                                className="relative flex items-center justify-center"
                                style={{
                                    width: `${innerSize}px`,
                                    height: `${innerSize}px`,
                                    transform: `scale(${scale.x}, ${scale.y})`,
                                    transition: "transform 0.1s ease-in-out"
                                }}
                            >
                                <div
                                    className="absolute bg-black rounded-full z-10 duration-[2000ms] transition-all animate-spin-slow"
                                    style={{
                                        width: `100%`,
                                        height: `100%`,
                                    }}
                                />
                                <div
                                    className="absolute bg-black rounded-full z-10 duration-[2000ms] transition-all animate-spin-slow"
                                    style={{
                                        width: `100%`,
                                        height: `100%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        className="mt-4 bg-[#2d2da8] text-white px-4 py-2 rounded w-full"
                        onClick={handleClaim}
                    >
                        Claim
                    </button>
                </div>

                <p className="text-[18px] text-white">
                    Currently Balance: {balance.toFixed(3)}
                </p>
            </div>
        </div>
    );
};

export default Layout;
