
Feature: Guide
  As a new user
  To explore plugin features
  I should be able to see small guide

  Scenario: Big hello help text
    Given I am watch "toDEHZzsIGw" video
    When I wait "3" seconds
    Then I should see ".adr-guide-container .screen-image" element

  Scenario: Pulsating AD button
    Given I am watch "toDEHZzsIGw" video
    When I wait "3" seconds
    And I click ".adr-guide-container .screen-image" element
    # TODO: Keep controls shown even if video is playing
    And I pause the video
    Then I should see ".adr-mark-ad-button.adr-pulse" element

  Scenario: Highlight clickable area
    Given I am watch "toDEHZzsIGw" video
    When I wait "3" seconds
    And I click ".adr-guide-container .screen-image" element
    # TODO: Keep controls shown even if video is playing
    And I pause the video
    And I click ".adr-mark-ad-button.adr-pulse" element
    Then I should see ".adr-ad-help-text.highlight" element
    And I should not see ".adr-ad-help-text.highlight.inactive" element
    And I wait "2" seconds
    And I should see ".adr-ad-help-text.highlight.inactive" element
    And I should not see ".adr-mark-ad-button.adr-pulse" element
