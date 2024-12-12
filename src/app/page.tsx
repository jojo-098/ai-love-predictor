'use client'
import { useState } from 'react'

type FormData = {
  user: {
    age: string;
    gender: string;
    zodiac: string;
  };
  partner: {
    age: string;
    gender: string;
    zodiac: string;
  };
}

type ValidationErrors = {
  user: {
    age?: string;
    gender?: string;
    zodiac?: string;
  };
  partner: {
    age?: string;
    gender?: string;
    zodiac?: string;
  };
}

type AnalysisResult = {
  category: string;
  content: string;
  suggestion: string;
  icon: string;
}

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    user: { age: '', gender: '', zodiac: '' },
    partner: { age: '', gender: '', zodiac: '' }
  })
  const [errors, setErrors] = useState<ValidationErrors>({ user: {}, partner: {} })
  const [result, setResult] = useState<{
    score: number;
    analysis: AnalysisResult[];
    compatibility: string;
    overallSuggestion: string;
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const zodiacSigns = [
    "白羊座", "金牛座", "双子座", "巨蟹座", 
    "狮子座", "处女座", "天秤座", "天蝎座",
    "射手座", "摩羯座", "水瓶座", "双鱼座"
  ]

  const handleInputChange = (person: 'user' | 'partner', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        [field]: value
      }
    }))
  }

  const validateForm = (step: number): boolean => {
    const newErrors: ValidationErrors = { user: {}, partner: {} }
    let isValid = true

    const validateAge = (age: string, person: 'user' | 'partner') => {
      if (!age) {
        newErrors[person].age = '年龄不能为空'
        isValid = false
      } else if (parseInt(age) < 18 || parseInt(age) > 100) {
        newErrors[person].age = '年龄必须在18-100岁之间'
        isValid = false
      }
    }

    const validateFields = (person: 'user' | 'partner') => {
      if (!formData[person].gender) {
        newErrors[person].gender = '请选择性别'
        isValid = false
      }
      if (!formData[person].zodiac) {
        newErrors[person].zodiac = '请选择星座'
        isValid = false
      }
    }

    if (step === 1) {
      validateAge(formData.user.age, 'user')
      validateFields('user')
    } else if (step === 2) {
      validateAge(formData.partner.age, 'partner')
      validateFields('partner')
    }

    setErrors(newErrors)
    return isValid
  }

  const handleNext = () => {
    if (!validateForm(step)) return

    if (step === 2) {
      calculateCompatibility()
    } else {
      setStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    setStep(prev => prev - 1)
  }

  const zodiacCompatibility: { [key: string]: { best: string[], good: string[], neutral: string[] } } = {
    "白羊座": {
      best: ["狮子座", "射手座"],
      good: ["双子座", "天秤座"],
      neutral: ["水瓶座", "金牛座"]
    },
    "金牛座": {
      best: ["处女座", "摩羯座"],
      good: ["巨蟹座", "天蝎座"],
      neutral: ["双鱼座", "白羊座"]
    },
    "双子座": {
      best: ["天秤座", "水瓶座"],
      good: ["白羊座", "狮子座"],
      neutral: ["射手座", "处女座"]
    },
    "巨蟹座": {
      best: ["天蝎座", "双鱼座"],
      good: ["金牛座", "处女座"],
      neutral: ["摩羯座", "白羊座"]
    },
    "狮子座": {
      best: ["白羊座", "射手座"],
      good: ["双子座", "天秤座"],
      neutral: ["水瓶座", "金牛座"]
    },
    "处女座": {
      best: ["金牛座", "摩羯座"],
      good: ["巨蟹座", "天蝎座"],
      neutral: ["双鱼座", "白羊座"]
    },
    "天秤座": {
      best: ["双子座", "水瓶座"],
      good: ["狮子座", "射手座"],
      neutral: ["白羊座", "天蝎座"]
    },
    "天蝎座": {
      best: ["巨蟹座", "双鱼座"],
      good: ["金牛座", "处女座"],
      neutral: ["摩羯座", "白羊座"]
    },
    "射手座": {
      best: ["白羊座", "狮子座"],
      good: ["双子座", "天秤座"],
      neutral: ["水瓶座", "金牛座"]
    },
    "摩羯座": {
      best: ["金牛座", "处女座"],
      good: ["天蝎座", "双鱼座"],
      neutral: ["巨蟹座", "白羊座"]
    },
    "水瓶座": {
      best: ["双子座", "天秤座"],
      good: ["白羊座", "射手座"],
      neutral: ["狮子座", "处女座"]
    },
    "双鱼座": {
      best: ["巨蟹座", "天蝎座"],
      good: ["金牛座", "摩羯座"],
      neutral: ["处女座", "白羊座"]
    }
  }

  const calculateCompatibility = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    let score = 70
    const analysis: AnalysisResult[] = []
    
    // 年龄分析
    const ageDiff = Math.abs(parseInt(formData.user.age) - parseInt(formData.partner.age))
    if (ageDiff <= 3) {
      score += 10
      analysis.push({
        category: "年龄差异",
        icon: "🎂",
        content: `你们的年龄差为${ageDiff}岁，年龄差异很小，容易产生共鸣。`,
        suggestion: "可以多分享同时代的共同话题，增进感情。"
      })
    } else if (ageDiff <= 5) {
      score += 5
      analysis.push({
        category: "年龄差异",
        icon: "🎂",
        content: `你们的年龄差为${ageDiff}岁，属于比较理想的范围。`,
        suggestion: "可以互相学习对方不同年代的经历和见解，让关系更加丰富。"
      })
    } else if (ageDiff <= 10) {
      analysis.push({
        category: "年龄差异",
        icon: "🎂",
        content: `你们的年龄差为${ageDiff}岁，需要更多理解和包容。`,
        suggestion: "建议多沟通彼此的人生经历和价值观，找到共同话题。"
      })
    } else {
      score -= 10
      analysis.push({
        category: "年龄差异",
        icon: "🎂",
        content: `你们的年龄差为${ageDiff}岁，可能面临一些代沟问题。`,
        suggestion: "建议多了解对方的成长背景，保持开放和包容的心态。重点关注共同的兴趣爱好，而不是年龄差异。"
      })
    }

    // 星座分析
    const userZodiac = formData.user.zodiac
    const partnerZodiac = formData.partner.zodiac
    const compatibility = zodiacCompatibility[userZodiac]
    
    if (compatibility.best.includes(partnerZodiac)) {
      score += 10
      analysis.push({
        category: "星座相性",
        icon: "⭐",
        content: `${userZodiac}和${partnerZodiac}是非常理想的星座组合！`,
        suggestion: "你们的性格特点非常互补，建议发挥各自优势，相互支持。"
      })
    } else if (compatibility.good.includes(partnerZodiac)) {
      score += 5
      analysis.push({
        category: "星座相性",
        icon: "⭐",
        content: `${userZodiac}和${partnerZodiac}是不错的星座组合。`,
        suggestion: "适当关注对方的性格特点，在相处中互相迁就，感情会更加稳定。"
      })
    } else if (compatibility.neutral.includes(partnerZodiac)) {
      analysis.push({
        category: "星座相性",
        icon: "⭐",
        content: `${userZodiac}和${partnerZodiac}的星座组合需要更多理解。`,
        suggestion: "建议多观察对方的性格特点，适当调整自己的沟通方式。"
      })
    } else {
      score -= 5
      analysis.push({
        category: "星座相性",
        icon: "⭐",
        content: `${userZodiac}和${partnerZodiac}的星座组合可能需要更多努力。`,
        suggestion: "虽然星座相性不是最理想，但真诚的沟通和理解可以克服这些差异。建议多关注对方的想法和感受。"
      })
    }

    // 性别组合分析
    const genderMatch = {
      category: "性别组合",
      icon: "💑",
      content: `${formData.user.gender === 'male' ? '男' : '女'}生和${formData.partner.gender === 'male' ? '男' : '女'}生组合`,
      suggestion: formData.user.gender !== formData.partner.gender ?
        "异性相吸是很自然的，建议多了解对方的思维方式和情感需求。" :
        "相同性别可能更容易理解对方，但也要注意保持适当的独立空间。"
    }
    analysis.push(genderMatch)

    // 计算最终分数和整体建议
    const finalScore = Math.min(100, Math.max(0, score))
    let compatibility_text = ''
    let overallSuggestion = ''

    if (finalScore >= 85) {
      compatibility_text = '天生一对'
      overallSuggestion = "你们的匹配度非常高！建议：\n" +
        "1. 保持真诚的沟通和理解\n" +
        "2. 共同规划未来，制定共同目标\n" +
        "3. 在保持甜蜜的同时，也要保持适当的个人空间\n" +
        "4. 多创造共同的美好回忆"
    } else if (finalScore >= 70) {
      compatibility_text = '较为般配'
      overallSuggestion = "你们有着不错的匹配度！建议：\n" +
        "1. 多关注对方的需求和感受\n" +
        "2. 培养共同的兴趣爱好\n" +
        "3. 遇到分歧时保持开放和包容的心态\n" +
        "4. 给予对方足够的成长空间"
    } else {
      compatibility_text = '需要更多了解'
      overallSuggestion = "虽然匹配度不是最理想，但真爱可以超越一切！建议：\n" +
        "1. 保持耐心，给予彼此更多的理解和包容\n" +
        "2. 多进行深入的沟通，了解对方的想法和感受\n" +
        "3. 寻找并珍惜共同的兴趣和价值观\n" +
        "4. 适当调整自己的期望，专注于感情的成长"
    }

    setResult({
      score: finalScore,
      analysis,
      compatibility: compatibility_text,
      overallSuggestion
    })

    setIsLoading(false)
    setStep(3)
  }

  const handleRetry = () => {
    setStep(1)
    setResult(null)
    setFormData({
      user: { age: '', gender: '', zodiac: '' },
      partner: { age: '', gender: '', zodiac: '' }
    })
  }

  const renderProgressBar = () => (
    <div className="w-full mb-6">
      <div className="flex justify-between mb-2">
        <span className={`text-sm ${step >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>你的信息</span>
        <span className={`text-sm ${step >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>对方信息</span>
        <span className={`text-sm ${step >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>分析结果</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        ></div>
      </div>
    </div>
  )

  const renderForm = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                你的年龄
              </label>
              <input 
                type="number" 
                value={formData.user.age}
                onChange={(e) => handleInputChange('user', 'age', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                          ${errors.user.age ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="请输入年龄"
                required
              />
              {errors.user.age && (
                <p className="mt-1 text-sm text-red-500">{errors.user.age}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                你的性别
              </label>
              <select 
                value={formData.user.gender}
                onChange={(e) => handleInputChange('user', 'gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">请选择性别</option>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                你的星座
              </label>
              <select 
                value={formData.user.zodiac}
                onChange={(e) => handleInputChange('user', 'zodiac', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">请选择星座</option>
                {zodiacSigns.map(sign => (
                  <option key={sign} value={sign}>{sign}</option>
                ))}
              </select>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                对方年龄
              </label>
              <input 
                type="number" 
                value={formData.partner.age}
                onChange={(e) => handleInputChange('partner', 'age', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="请输入对方年龄"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                对方性别
              </label>
              <select 
                value={formData.partner.gender}
                onChange={(e) => handleInputChange('partner', 'gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">请选择性别</option>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                对方星座
              </label>
              <select 
                value={formData.partner.zodiac}
                onChange={(e) => handleInputChange('partner', 'zodiac', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">请选择星座</option>
                {zodiacSigns.map(sign => (
                  <option key={sign} value={sign}>{sign}</option>
                ))}
              </select>
            </div>
          </div>
        )
      case 3:
        return result && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-purple-600 mb-4">
                {result.score}%
              </div>
              <div className="text-2xl font-semibold mb-6 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
                {result.compatibility}
              </div>
            </div>
            <div className="space-y-6">
              {result.analysis.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">
                    {item.icon} {item.category}
                  </h3>
                  <p className="text-gray-600 mb-2">{item.content}</p>
                  <p className="text-gray-700 italic">{item.suggestion}</p>
                </div>
              ))}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">💝 整体建议</h3>
                <p className="text-gray-700 whitespace-pre-line">{result.overallSuggestion}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleRetry}
                className="flex-1 py-3 px-6 text-white font-semibold rounded-lg 
                         bg-gradient-to-r from-pink-500 to-purple-500 
                         hover:from-pink-600 hover:to-purple-600 
                         transform transition-all duration-200 hover:scale-105
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                重新测试
              </button>
              <button 
                onClick={() => {
                  const text = `我和TA的契合度测试结果：${result.score}%\n${result.compatibility}\n\n快来测试你们的缘分吧！`
                  if (navigator.share) {
                    navigator.share({
                      title: 'AI恋爱契合度测试结果',
                      text: text,
                      url: window.location.href
                    })
                  } else {
                    navigator.clipboard.writeText(text)
                    alert('结果已复制到剪贴板！')
                  }
                }}
                className="flex-1 py-3 px-6 text-purple-600 font-semibold rounded-lg 
                         border-2 border-purple-500 hover:bg-purple-50
                         transform transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                分享结果
              </button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-24">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
        AI 恋爱契合度预测
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 mb-8 text-center">
        通过AI智能分析，预测你们的契合程度
      </p>
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-full max-w-md">
        {!showForm ? (
          <>
            <p className="text-center text-gray-700 mb-6">
              即将开始你的缘分测试...
            </p>
            <button 
              onClick={() => setShowForm(true)}
              className="w-full py-3 px-6 text-white font-semibold rounded-lg 
                       bg-gradient-to-r from-pink-500 to-purple-500 
                       hover:from-pink-600 hover:to-purple-600 
                       transform transition-all duration-200 hover:scale-105
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              开始测试
            </button>
          </>
        ) : (
          <div>
            {renderProgressBar()}
            <form className="space-y-6">
              {renderForm()}
              <div className="flex gap-4">
                {step > 1 && (
                  <button 
                    type="button"
                    onClick={handlePrev}
                    className="flex-1 py-3 px-6 text-purple-600 font-semibold rounded-lg 
                             border-2 border-purple-500
                             hover:bg-purple-50
                             transform transition-all duration-200
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                  >
                    上一步
                  </button>
                )}
                <button 
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                  className={`flex-1 py-3 px-6 text-white font-semibold rounded-lg 
                           bg-gradient-to-r from-pink-500 to-purple-500 
                           hover:from-pink-600 hover:to-purple-600 
                           transform transition-all duration-200 hover:scale-105
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                           disabled:opacity-50 disabled:cursor-not-allowed
                           ${isLoading ? 'animate-pulse' : ''}`}
                >
                  {isLoading ? '分析中...' : step === 2 ? '开始分析' : '下一步'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  )
} 