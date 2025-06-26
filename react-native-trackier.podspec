require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name           = package['name']
  s.version        = '1.6.73'
  s.summary        = package['title']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage     = "https://github.com/trackier/react-native-sdk"
  s.authors      = { "Dev" => "dev@trackier.com" }
  s.platforms    = { :ios => "11.0" }
  s.swift_version = '5.0'
  s.source       = { :git => "https://github.com/trackier/react-native-sdk.git", :tag => "#{s.version}" }

  s.source_files = "ios/*.{h,c,m,swift}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency 'trackier-ios-sdk', '1.6.73'
end

